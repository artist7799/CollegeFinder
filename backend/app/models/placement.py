from app.extensions import db

class Placement(db.Model):
    __tablename__ = 'placements'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    college_id = db.Column(db.Integer, db.ForeignKey('colleges.id', ondelete='CASCADE'), nullable=False)
    average_package = db.Column(db.Float, nullable=True)
    highest_package = db.Column(db.Float, nullable=True)
    placement_percentage = db.Column(db.Float, nullable=True)
    recruiting_companies = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'college_id': self.college_id,
            'average_package': float(self.average_package) if self.average_package is not None else 0.0,
            'highest_package': float(self.highest_package) if self.highest_package is not None else 0.0,
            'placement_percentage': float(self.placement_percentage) if self.placement_percentage is not None else 0.0,
            'recruiting_companies': self.recruiting_companies
        }

    def __repr__(self):
        return f"<Placement College #{self.college_id}>"
