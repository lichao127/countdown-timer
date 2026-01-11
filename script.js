class CountdownTimer {
    constructor() {
        // DOM Elements
        this.hoursInput = document.getElementById('hours');
        this.warningThresholdInput = document.getElementById('warningThreshold');
        this.warningMessageInput = document.getElementById('warningMessage');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.timeDisplay = document.getElementById('timeRemaining');
        this.warningDisplay = document.getElementById('warningDisplay');
        this.warningText = document.getElementById('warningText');
        
        // State
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.warningThresholdSeconds = 0;
        this.warningMessage = '';
        this.timerInterval = null;
        this.isRunning = false;
        this.warningTriggered = false;
        
        // Initialize
        this.init();
    }
    
    init() {
        this.startBtn.addEventListener('click', () => this.start());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.updateDisplay(0);
    }
    
    start() {
        if (this.isRunning) return;
        
        // Get values
        const hours = parseFloat(this.hoursInput.value) || 0;
        const warningMinutes = parseFloat(this.warningThresholdInput.value) || 0;
        this.warningMessage = this.warningMessageInput.value || 'Time is running out!';
        
        // Validate
        if (hours <= 0) {
            alert('Please enter a valid number of hours greater than 0');
            return;
        }
        
        if (warningMinutes <= 0) {
            alert('Please enter a valid warning threshold greater than 0');
            return;
        }
        
        // Calculate seconds
        this.totalSeconds = hours * 3600;
        this.remainingSeconds = this.totalSeconds;
        this.warningThresholdSeconds = warningMinutes * 60;
        
        // Check if warning threshold is greater than total time
        if (this.warningThresholdSeconds >= this.totalSeconds) {
            alert('Warning threshold must be less than the total countdown time');
            return;
        }
        
        // Update UI
        this.isRunning = true;
        this.warningTriggered = false;
        this.startBtn.disabled = true;
        this.resetBtn.disabled = false;
        this.disableInputs(true);
        
        // Add running class to container for fullscreen mode
        document.querySelector('.container').classList.add('running');
        
        // Set up warning message (low contrast)
        this.warningText.textContent = this.warningMessage;
        this.warningDisplay.classList.add('low-contrast');
        this.warningDisplay.classList.remove('high-contrast');
        
        // Start countdown
        this.updateDisplay(this.remainingSeconds);
        this.timerInterval = setInterval(() => this.tick(), 1000);
    }
    
    tick() {
        this.remainingSeconds--;
        this.updateDisplay(this.remainingSeconds);
        
        // Check if warning threshold reached
        if (!this.warningTriggered && this.remainingSeconds <= this.warningThresholdSeconds) {
            this.triggerWarning();
        }
        
        // Check if time is up
        if (this.remainingSeconds <= 0) {
            this.complete();
        }
    }
    
    triggerWarning() {
        this.warningTriggered = true;
        
        // Make page red
        document.body.classList.add('warning');
        
        // Make warning message high contrast
        this.warningDisplay.classList.remove('low-contrast');
        this.warningDisplay.classList.add('high-contrast');
    }
    
    complete() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.updateDisplay(0);
        alert('Time is up!');
    }
    
    reset() {
        // Clear interval
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Reset state
        this.isRunning = false;
        this.warningTriggered = false;
        this.remainingSeconds = 0;
        
        // Reset UI
        this.startBtn.disabled = false;
        this.resetBtn.disabled = true;
        this.disableInputs(false);
        this.updateDisplay(0);
        
        // Remove warning styles
        document.body.classList.remove('warning');
        this.warningDisplay.classList.remove('low-contrast', 'high-contrast');
        this.warningText.textContent = '';
        
        // Remove running class from container
        document.querySelector('.container').classList.remove('running');
    }
    
    updateDisplay(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        this.timeDisplay.textContent = 
            `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
    }
    
    pad(num) {
        return num.toString().padStart(2, '0');
    }
    
    disableInputs(disabled) {
        this.hoursInput.disabled = disabled;
        this.warningThresholdInput.disabled = disabled;
        this.warningMessageInput.disabled = disabled;
    }
}

// Initialize the timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});
