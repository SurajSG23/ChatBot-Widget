def get_prompt(prompt_str, context_section):
    return (
        f"User Prompt:\n{prompt_str}\n\n"
        f"The following are 5 relevant context chunks curated to support the assistant in addressing the user's query:\n"
        f"{context_section}\n\n"
    )
