def check_eligibility(student_skills, company_skills):
    return all(skill in student_skills for skill in company_skills)