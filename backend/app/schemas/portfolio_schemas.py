from marshmallow import Schema,fields

class PortfoliosRecordSchema(Schema):
    id=fields.Int(dump_only=True)
    asset_name = fields.Str(required=True)
    asset_type = fields.Str(required=True)
    purchase_date = fields.Date(required=True)
    purchase_price = fields.Float(required=True)
    quantity = fields.Int(required=True)
    current_price = fields.Float(required=True)
    return_percentage = fields.Float(required=True)