document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Gather form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const businessName = formData.get('businessName');
        const message = formData.get('message');

        // Your EmailJS service ID, template ID, and Public Key
        const serviceId = 'service_5ea1t9n';
        const templateId = 'template_rpd6vpw';
        const publicKey = 'KdQihMQM0l6ibmgts';

        // Create a new object that contains dynamic template params
        const templateParams = {
            from_name: name,
            from_email: email,
            business_name: businessName,
            message: message
        };

        // Send the email using EmailJS
        emailjs.send(serviceId, templateId, templateParams, publicKey)
            .then((response) => {
                console.log('Email sent successfully!', response);
                // Add any additional logic you want after the email is sent
                // For example, show a success message
                alert('Message sent successfully!');
                form.reset(); // Optionally reset the form
            })
            .catch((error) => {
                console.error('Error sending email:', error);
                // Handle error, for example, show an error message
                alert('Error sending message. Please try again later.');
            });
    });
});
