from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from auth.dependencies import get_current_user
from db.mongodb import database
from templates.schemas import TemplateCreate
from bson import ObjectId

router = APIRouter(prefix="/templates", tags=["Templates"])


@router.get("")
async def get_templates(user: str = Depends(get_current_user)):
    """Get all templates for the current user"""
    try:
        templates = await database.templates.find(
            {"user_email": user}
        ).sort("created_at", -1).to_list(100)
        
        for template in templates:
            template["_id"] = str(template["_id"])
            template["created_at"] = template["created_at"].isoformat()
        
        return templates
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching templates: {str(e)}")


@router.post("")
async def create_template(
    template: TemplateCreate,
    user: str = Depends(get_current_user)
):
    """Create a new template"""
    try:
        template_data = {
            "user_email": user,
            "name": template.name,
            "content": template.content,
            "tone": template.tone,
            "description": template.description,
            "created_at": datetime.utcnow()
        }
        
        result = await database.templates.insert_one(template_data)
        template_data["_id"] = str(result.inserted_id)
        template_data["created_at"] = template_data["created_at"].isoformat()
        
        return {"message": "Template created successfully", "template": template_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating template: {str(e)}")


@router.get("/{template_id}")
async def get_template(
    template_id: str,
    user: str = Depends(get_current_user)
):
    """Get a single template by ID"""
    try:
        template = await database.templates.find_one({
            "_id": ObjectId(template_id),
            "user_email": user
        })
        
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        template["_id"] = str(template["_id"])
        template["created_at"] = template["created_at"].isoformat()
        
        return template
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid template ID: {str(e)}")


@router.delete("/{template_id}")
async def delete_template(
    template_id: str,
    user: str = Depends(get_current_user)
):
    """Delete a template"""
    try:
        result = await database.templates.delete_one({
            "_id": ObjectId(template_id),
            "user_email": user
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Template not found")
        
        return {"message": "Template deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error deleting template: {str(e)}")
