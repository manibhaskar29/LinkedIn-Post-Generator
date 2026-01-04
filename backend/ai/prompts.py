def build_prompt(topic: str, tone: str, hoot: str, cta: str):
    system_promt = "You are a professional Linked Content Writer. Write concise, engaging posts with clear structure."

    user_prompt = f"""
    Topic: {topic}
    Tone: {tone}
    Hoot: {hoot}
    CTA: {cta}

    Write a LinkedIn post with:
     - Strong opening hook
     - Short paragraphs
     - Clear CTA at the end
    """

    return system_promt, user_prompt