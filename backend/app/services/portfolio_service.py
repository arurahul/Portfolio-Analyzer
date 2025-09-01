from ..models import PortfolioRecords
from ..extensions import db
from flask import jsonify
from datetime import datetime
import random
class PortfolioService:

    @staticmethod
    def get_all_records():
        """Return all portfolio records (Admin use)."""
        return PortfolioRecords.query.all()

    @staticmethod
    def get_records_by_user(user_id):
        """Return portfolio records for a specific client/user."""
        return PortfolioRecords.query.filter_by(user_id=user_id).all()

    @staticmethod
    def create_record_from_row(row, user_id):
        """Create a PortfolioRecords object from CSV row."""
        return PortfolioRecords(
            user_id=user_id,
            asset_name=row.get("asset_name"),
            asset_type=row.get("asset_type"),
            quantity=float(row.get("quantity", 0)),
            value=float(row.get("value", 0)),
        )

    @staticmethod
    def add_records(records):
        """Bulk insert portfolio records."""
        db.session.bulk_save_objects(records)
        db.session.commit()
        
        
    @staticmethod
    def update_records(record_id,user_id,quanity,value):
        """Update portfolio record."""
        record=PortfolioRecords.query.filter(id=record_id,user_id=user_id)
        if not record:
            return None
        if quanity is not None:
            record.quantity=quanity
        if value is not None:
            record.value=value
        db.seesion.commit()
        return record
    
    @staticmethod
    def delete_records(record_id,user_id):
        """Delete portfolio record."""
        record=PortfolioRecords.query.filter(id=record_id,user_id=user_id)
        if not record:
            return None
        db.session.delete(record_id)
        db.seesion.commit()
        return True
        
    @staticmethod
    def get_alalytics(user_id,start_dates,end_dates):
        if start_dates:
            try:
                start_date = datetime.strptime(start_dates, "%Y-%m-%d")
                query = query.filter(PortfolioRecords.date >= start_date)
            except ValueError:
                return jsonify({"error": "Invalid start_date format, use YYYY-MM-DD"}), 400

        if end_dates:
            try:
                end_date = datetime.strptime(end_dates, "%Y-%m-%d")
                query = query.filter(PortfolioRecords.date <= end_date)
            except ValueError:
                return jsonify({"error": "Invalid end_date format, use YYYY-MM-DD"}), 400

        records = query.order_by(PortfolioRecords.date.asc()).all()
        if not records:
            return ({
                "message":"No Portfolio records found"
            }),404
        latest_records={}
        for r in records:
            latest_records[r.asset_name] = r
        
        total_value=sum(r.value for r in latest_records.values())
        
        risk_score=round(random.uniform(1,10),2)
        
        allocation = {}
        for r in latest_records.values():
            allocation[r.asset_type] = allocation.get(r.asset_type, 0) + r.value
        allocation_data = [{"name": k, "value": v} for k, v in allocation.items()]
        
        trend = []
        grouped_by_date = {}
        for r in records:
            date_str = r.date.strftime("%Y-%m-%d")
            grouped_by_date[date_str] = grouped_by_date.get(date_str, 0) + r.value
        
        trend = [{"date": d, "value": grouped_by_date[d]} for d in sorted(grouped_by_date.keys())]
            
        holdings_sorted = sorted(latest_records.values(), key=lambda x: x.value, reverse=True)
        top_holdings = [{"name": r.asset_name, "value": r.value} for r in holdings_sorted[:5]]
          # Example risk per asset for heatmap or table
        risk_per_asset = [{"asset_name": r.asset_name, "risk_score": round(random.uniform(1,10),2)} for r in latest_records.values()]
    
        return jsonify({
            "totalValue": total_value,
            "riskScore": risk_score,
            "allocation": allocation_data,
            "history": trend,
            "topHoldings": top_holdings,
            "risk": risk_per_asset

        })
    