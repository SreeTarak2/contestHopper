document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('edit-profile-btn');
    const saveBtn = document.getElementById('save-profile-btn');
    const form = document.getElementById('profile-form');
    const inputs = form.querySelectorAll('input, textarea');

    editBtn.addEventListener('click', () => {
        inputs.forEach(input => input.disabled = false);
        editBtn.hidden = true;
        saveBtn.hidden = false;
        form.querySelector('input').focus();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real app, this would send data to a server
        console.log('Profile changes saved!');
        
        inputs.forEach(input => input.disabled = true);
        editBtn.hidden = false;
        saveBtn.hidden = true;
        
        // Update display names if they exist
        document.getElementById('profile-display-name').textContent = document.getElementById('fullName').value;
        document.getElementById('profile-display-email').textContent = document.getElementById('email').value;
    });
});