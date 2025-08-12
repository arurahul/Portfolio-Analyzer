from ..models import PortfolioRecords
from ..extensions import db


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
