import { videos } from './videos.js';

document.addEventListener("DOMContentLoaded", () => {
    const questionsList = document.querySelector("#questions-list");
    
    const progressPercentage = document.querySelector("#progress-percentage");
    const videoPlayer = document.querySelector("#video-player iframe");
    const summarySection = document.querySelector("#summary p");
    const videoList = document.querySelector("#video-list ul");
    const nextButton = document.querySelector("#next-btn");
    const prevButton = document.querySelector("#prev-btn");
    const progressBar = document.querySelector("#progress-bar");
    const messageContainer = document.createElement("div"); // Create a container for messages
    
    const downloadCertificateButton = document.getElementById("download-certificate");
    const stars = document.querySelectorAll('.star');
    const feedback = document.getElementById('rating-feedback');
    let currentVideoIndex = 0;

    // Load video list dynamically
    const loadVideoList = () => {
        videoList.innerHTML = "";
        videos.forEach((video, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${video.id}. ${video.title}</span>
                <input type="checkbox" class="completed-checkbox" data-index="${index}">
            `;
            li.addEventListener("click", () => loadVideo(index));
            videoList.appendChild(li);
        });
    };

    // Load a specific video
    const loadVideo = (index) => {
        currentVideoIndex = index;
        const video = videos[index];
        videoPlayer.src = video.url;
        summarySection.textContent = video.summary;
        updateNavigationButtons();
        updateQuestions(video.questions);
        updateProgress();
        updateCourseDescription(video.id);
    };

    // Update navigation buttons
    const updateNavigationButtons = () => {
        prevButton.disabled = currentVideoIndex === 0;
        nextButton.disabled = currentVideoIndex === videos.length - 1;
    };
    function updateCourseDescription(videoId) {
        const descriptionElement = document.getElementById("description-course");
        const video = videos.find((v) => v.id === videoId);
    
        if (video) {
            descriptionElement.textContent = video.description;
        } else {
            descriptionElement.textContent = "No description available for the selected video.";
        }
    }
    const updateQuestions = (questions) => {
        questionsList.innerHTML = "";
        questions.forEach((q) => {
            const li = document.createElement("li");
            li.textContent = q;
            questionsList.appendChild(li);
        });
    };
    // Mark video as completed and update progress
    const updateProgress = () => {
        const completedVideos = Array.from(videoList.querySelectorAll("input:checked")).length;
        const progress = (completedVideos / videos.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressPercentage.textContent = `${Math.round(progress)}% Completed`;
    };

    // Event listeners for navigation
    nextButton.addEventListener("click", () => {
        if (currentVideoIndex < videos.length - 1) {
            loadVideo(currentVideoIndex + 1);
        }
    });

    prevButton.addEventListener("click", () => {
        if (currentVideoIndex > 0) {
            loadVideo(currentVideoIndex - 1);
        }
    });

    videoList.addEventListener("change", updateProgress);

    // Handle course rating
    stars.forEach((star) => {
        star.addEventListener('click', (e) => {
            // Get the selected rating value
            const selectedRating = e.target.getAttribute('data-value');

            // Reset all stars
            stars.forEach((s) => s.classList.remove('selected'));

            // Highlight stars up to the selected one
            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.add('selected');
            }

            // Show feedback message
            feedback.style.display = 'block';
            feedback.textContent = `Thank you for rating the course ${selectedRating} star${selectedRating > 1 ? 's' : ''}!`;
        });
    });

    // Download certificate
    messageContainer.id = "message-container";
    messageContainer.style.marginLeft = "15px";
    messageContainer.style.color = "red";
    messageContainer.style.fontSize = "1rem";
    messageContainer.style.display = "none"; // Hide initially
    downloadCertificateButton.parentNode.appendChild(messageContainer);
    downloadCertificateButton.addEventListener("click", () => {
        const completedVideos = Array.from(videoList.children).filter((item) =>
            item.querySelector("input[type='checkbox']").checked
        ).length;
    
        if (completedVideos === videos.length) {
            // Show success message
            messageContainer.textContent = "Congratulations on completing the course! Your certificate is downloading.";
            messageContainer.style.color = "green"; // Success message in green
            messageContainer.style.display = "block";
    
            // Simulate certificate download
            setTimeout(() => {
                window.open("certificate.pdf", "_blank");
            }, 1000); // Delay for better user experience
        } else {
            // Show error message
            messageContainer.textContent = "Please complete all videos to download your certificate.";
            messageContainer.style.color = "red"; // Error message in red
            messageContainer.style.display = "block";
        }
    });
    // Initialize
    loadVideoList();
    loadVideo(0);
});
