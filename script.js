// Script to toggle FAQ items
document.addEventListener('DOMContentLoaded', function () {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const content = this.nextElementSibling;
            
            // Toggle display of the content
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });
});
