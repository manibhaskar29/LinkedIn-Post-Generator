def build_prompt(topic: str, tone: str, hook: str, cta: str):
    system_prompt = "You are a professional Linked Content Writer. Write concise, engaging posts with clear structure."

    user_prompt = f"""
    Topic: {topic}
    Tone: {tone}
    Hook: {hook}
    CTA: {cta}

    Write a LinkedIn post with:
     - Strong opening hook
     - Short paragraphs
     - Clear CTA at the end
    """

    return system_prompt, user_prompt