document.addEventListener("DOMContentLoaded", function () {
    const emergencyButton = document.getElementById("emergencyButton");
    let mediaRecorder;
    let recordedChunks = [];

    // 📌 Function to Start Camera & Video Recording Automatically
    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            document.getElementById("videoElement").srcObject = stream;

            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => recordedChunks.push(event.data);
            mediaRecorder.onstop = saveRecording;
            mediaRecorder.start();
        } catch (error) {
            alert("Error accessing camera or microphone: " + error);
        }
    }

    // 📌 Function to Save Video Recording Locally
    function saveRecording() {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "emergency_recording.webm";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
    }

    // 📌 Function to Send Emergency Alert via WhatsApp
    function sendEmergencyMessage(location) {
        const trustedContact = "+91 8793634325";  // Replace with actual contact number
        const message = `🚨 EMERGENCY ALERT! 🚨\nLocation: ${location}\nPlease help immediately!`;

        // Open WhatsApp with a pre-filled emergency message
        const whatsappURL = `https://api.whatsapp.com/send?phone=${trustedContact}&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, "_blank");
 
    }

    // 📌 Function to Start a Video Call Automatically
    function startVideoCall() {
        const trustedContact = "+91 879363435";  // Replace with actual contact number

        // ✅ WhatsApp Video Call (Works only on mobile)
        const whatsappCallURL = `https://wa.me/${trustedContact}`;
        window.open(whatsappCallURL, "_blank");

        // ✅ Google Meet (User needs a predefined meeting link)
         //window.open("https://meet.google.com/rkj-nzrf-ftf", "_blank");
         //window.open("https://meet.google.com/your-meeting-link", "_blank");

        // ✅ Zoom Call (User needs Zoom installed)
         window.open("https://us05web.zoom.us/j/82852340094?pwd=BDXYTt2pmrRjmGqRZbynMUJz7koSBe.1", "_blank");
         //window.open("https://us04web.zoom.us/j/your-meeting-id", "_blank");


         //Stops the Emergency Button
        document.getElementById("stopRecordingButton").addEventListener("click", function () {
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop(); // Stops recording & triggers download
            }
        });
    }

    // 📌 Function to Get User's Live Location Automatically
    function getLocationAndSendAlert() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const location = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
                sendEmergencyMessage(location);
                startVideoCall(); // Auto-start video call after sending the alert
            }, error => {
                alert("Unable to access location: " + error.message);
            });
        } else {
            alert("Geolocation is not supported in this browser.");
        }
    }

    
    // 📌 Click Event: Trigger All Features
    emergencyButton.addEventListener("click", function () {
        //alert("⚠ Emergency Activated! Recording, Sending Alert, and Starting Video Call...");
        startRecording();         // Start video recording
        getLocationAndSendAlert(); // Get location & send alert
       


        
        
        // 📌 Function to Stop All Emergency Features
    function stopRecordingButton() {
        alert("⛔ Emergency Stopped! Turning off camera & stopping recording...");

        // ✅ Stop Video Recording
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
        }

        // ✅ Turn Off Camera
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            document.getElementById("videoElement").srcObject = null;
        }

        // ✅ Stop Location Tracking
        navigator.geolocation.clearWatch();

        // ✅ Close Open WhatsApp & Call Tabs (User must close manually)
        alert("Please close any open WhatsApp or video call tabs manually.");
    }

    });
});
