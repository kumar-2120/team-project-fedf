// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get references to the button and message elements
    const actionButton = document.getElementById('actionButton');
    const messageElement = document.getElementById('message');
    
    // Counter to track button clicks
    let clickCount = 0;
    
    // Array of messages to display
    const messages = [
        'Hello! 👋',
        'You clicked the button!',
        'JavaScript is working! 🎉',
        'Great job! 🌟',
        'Keep clicking! 🚀',
        'You are awesome! 💪'
    ];
    
    // Add click event listener to the button
    actionButton.addEventListener('click', function() {
        clickCount++;
        
        // Select a message based on click count
        const messageIndex = (clickCount - 1) % messages.length;
        const selectedMessage = messages[messageIndex];
        
        // Update the message element
        messageElement.textContent = `${selectedMessage} (Click #${clickCount})`;
        
        // Add a simple animation effect
        messageElement.style.opacity = '0';
        setTimeout(() => {
            messageElement.style.transition = 'opacity 0.3s';
            messageElement.style.opacity = '1';
        }, 50);
    });
    
    // Log to console to confirm JavaScript is loaded
    console.log('JavaScript loaded successfully!');
    console.log('Team Project FEDF is ready to go!');
});
