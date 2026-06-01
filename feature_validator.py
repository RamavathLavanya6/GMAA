import json
import logging
from typing import List, Dict, Any, Tuple
from pydantic import BaseModel, Field, ValidationError, validator

# Setup basic logging for the pipeline
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("FeatureValidationPipeline")

class ApplicationFeatureSchema(BaseModel):
    """
    Pydantic schema defining the expected features for the Global Mobility ML Inference Model.
    """
    name: str = Field(..., min_length=2, description="Applicant's full name")
    origin: str = Field(..., min_length=2, description="Origin country")
    destination: str = Field(..., min_length=2, description="Target destination country")
    visaType: str = Field(..., description="Category of visa")
    experience: int = Field(..., ge=0, le=50, description="Years of professional experience")
    skills: List[str] = Field(..., min_items=1, description="List of primary skills")

    @validator('visaType')
    def validate_visa_type(cls, v):
        allowed_types = ['skilled_worker', 'student', 'business', 'family_sponsorship']
        if v not in allowed_types:
            raise ValueError(f"Invalid visaType '{v}'. Allowed values: {', '.join(allowed_types)}")
        return v

    @validator('origin', 'destination')
    def validate_countries_not_equal(cls, v, values, field):
        # A simple business logic rule: origin and destination shouldn't be exactly the same
        if field.name == 'destination' and 'origin' in values:
            if v.lower() == values['origin'].lower():
                raise ValueError("Origin and destination countries cannot be the same.")
        return v


class FeatureValidationPipeline:
    """
    The main pipeline for validating incoming feature payloads before model inference.
    """
    def __init__(self):
        logger.info("Feature Validation Pipeline Initialized.")

    def run_validation(self, raw_payload: Dict[str, Any]) -> Tuple[bool, Dict[str, Any], List[str]]:
        """
        Runs the data through the validation schema.
        Returns: (is_valid, validated_data, list_of_errors)
        """
        logger.info(f"Received payload for validation: {raw_payload.get('name', 'Unknown')}")
        
        try:
            # Attempt to parse and validate the raw dictionary against our schema
            validated_features = ApplicationFeatureSchema(**raw_payload)
            logger.info("Validation successful. Features are clean and ready for inference.")
            return True, validated_features.dict(), []
            
        except ValidationError as e:
            # Catch Pydantic validation errors and format them
            error_messages = []
            for err in e.errors():
                loc = " -> ".join([str(x) for x in err['loc']])
                msg = err['msg']
                error_messages.append(f"Field '{loc}': {msg}")
                
            logger.error(f"Validation failed with {len(error_messages)} errors.")
            return False, {}, error_messages


if __name__ == "__main__":
    # --- Integration Test / Demonstration ---
    
    pipeline = FeatureValidationPipeline()
    
    # 1. Valid Payload Example
    valid_payload = {
        "name": "Jane Doe",
        "origin": "India",
        "destination": "Canada",
        "visaType": "skilled_worker",
        "experience": 5,
        "skills": ["Software Engineering", "Python"]
    }
    
    print("--- Testing Valid Payload ---")
    is_valid, data, errors = pipeline.run_validation(valid_payload)
    print(f"Is Valid: {is_valid}\nData: {data}\nErrors: {errors}\n")
    
    # 2. Invalid Payload Example (Testing bounds, enums, and business logic)
    invalid_payload = {
        "name": "J", # Too short
        "origin": "UK",
        "destination": "UK", # Same as origin
        "visaType": "tourist", # Not allowed
        "experience": -2, # Negative
        "skills": [] # Empty list
    }
    
    print("--- Testing Invalid Payload ---")
    is_valid, data, errors = pipeline.run_validation(invalid_payload)
    print(f"Is Valid: {is_valid}")
    for err in errors:
        print(f"- {err}")
