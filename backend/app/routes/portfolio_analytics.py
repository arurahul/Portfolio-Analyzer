from flask import Blueprint, jsonify, request, Response
from models import db, PortfolioRecord
import pandas as pd
import numpy as np
from io import StringIO, BytesIO
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet

portfolio_analytics_bp = Blueprint("portfolio_analytics", __name__)

# Helper: Get portfolio DataFrame
def get_portfolio_df():
    records = PortfolioRecord.query.order_by(PortfolioRecord.timestamp.asc()).all()
    if not records:
        return pd.DataFrame()
    data = [
        {
            "timestamp": r.timestamp,
            "symbol": r.symbol,
            "quantity": r.quantity,
            "price": r.price,
            "value": r.quantity * r.price,
        }
        for r in records
    ]
    df = pd.DataFrame(data)
    return df

# ---- Time-based performance ----
@portfolio_analytics_bp.route("/performance", methods=["GET"])
def performance():
    df = get_portfolio_df()
    if df.empty:
        return jsonify({"error": "No portfolio data"}), 404

    portfolio = df.groupby("timestamp")["value"].sum().reset_index()
    portfolio["return"] = portfolio["value"].pct_change().fillna(0)

    return jsonify(portfolio.to_dict(orient="records"))

# ---- Sharpe ratio ----
@portfolio_analytics_bp.route("/sharpe", methods=["GET"])
def sharpe():
    df = get_portfolio_df()
    if df.empty:
        return jsonify({"error": "No portfolio data"}), 404

    portfolio = df.groupby("timestamp")["value"].sum().reset_index()
    portfolio["return"] = portfolio["value"].pct_change().dropna()

    mean_return = portfolio["return"].mean()
    std_return = portfolio["return"].std()
    risk_free_rate = 0.02 / 252  # daily ~ 2% annualized

    if std_return == 0:
        sharpe_ratio = 0
    else:
        sharpe_ratio = (mean_return - risk_free_rate) / std_return

    return jsonify({"sharpe_ratio": round(sharpe_ratio, 4)})

# ---- Correlation Matrix ----
@portfolio_analytics_bp.route("/correlation", methods=["GET"])
def correlation():
    df = get_portfolio_df()
    if df.empty:
        return jsonify({"error": "No portfolio data"}), 404

    pivot = df.pivot_table(
        index="timestamp", columns="symbol", values="value", aggfunc="sum"
    ).fillna(0)

    returns = pivot.pct_change().dropna()
    corr_matrix = returns.corr()

    return jsonify(corr_matrix.round(3).to_dict())

# ---- Export CSV ----
@portfolio_analytics_bp.route("/export/csv", methods=["GET"])
def export_csv():
    df = get_portfolio_df()
    if df.empty:
        return jsonify({"error": "No data"}), 404

    portfolio = df.groupby("timestamp")["value"].sum().reset_index()
    returns = portfolio["value"].pct_change().dropna()
    pivot = df.pivot_table(index="timestamp", columns="symbol", values="value").fillna(0)
    corr_matrix = pivot.pct_change().dropna().corr()

    buffer = StringIO()
    df.to_csv(buffer, index=False)
    buffer.write("\n\nPortfolio Performance\n")
    portfolio.to_csv(buffer, index=False)
    buffer.write("\n\nCorrelation Matrix\n")
    corr_matrix.to_csv(buffer)

    return Response(buffer.getvalue(), mimetype="text/csv")

# ---- Export PDF ----
@portfolio_analytics_bp.route("/export/pdf", methods=["GET"])
def export_pdf():
    df = get_portfolio_df()
    if df.empty:
        return jsonify({"error": "No data"}), 404

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = [Paragraph("Portfolio Analytics Report", styles["Title"]), Spacer(1, 20)]

    # Portfolio summary
    portfolio = df.groupby("timestamp")["value"].sum().reset_index()
    story.append(Paragraph("Portfolio Growth", styles["Heading2"]))
    for _, row in portfolio.iterrows():
        story.append(Paragraph(f"{row['timestamp']}: ${row['value']:.2f}", styles["Normal"]))

    # Correlation matrix
    pivot = df.pivot_table(index="timestamp", columns="symbol", values="value").fillna(0)
    corr_matrix = pivot.pct_change().dropna().corr()
    story.append(Spacer(1, 20))
    story.append(Paragraph("Correlation Matrix", styles["Heading2"]))
    corr_data = [ [str(c) for c in ["Symbol"] + list(corr_matrix.columns)] ]
    for idx, row in corr_matrix.iterrows():
        corr_data.append([idx] + [f"{v:.2f}" for v in row.values])
    story.append(Table(corr_data))

    doc.build(story)
    pdf_value = buffer.getvalue()
    buffer.close()

    return Response(pdf_value, mimetype="application/pdf")
