from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AnalyticsOverview(BaseModel):
    """Overall analytics summary"""
    total_posts: int
    avg_engagement: float
    total_views: int
    total_clicks: int
    total_shares: int
    engagement_trend: list  # List of dict with date and score


class PostEngagement(BaseModel):
    """Individual post engagement metrics"""
    post_id: str
    views: int
    clicks: int
    shares: int
    engagement_score: float
