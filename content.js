// A memory list to store wrong answers we have already screamed at
const playedMistakes = new Set(); 

const observer = new MutationObserver(() => {
    
    // Find all the "You Marked" badges
    const dangerSpans = document.querySelectorAll('span[class*="content-danger"]');
    
    dangerSpans.forEach(span => {
        // Double check it actually says "You Marked"
        if (span.textContent && span.textContent.includes("You Marked")) {
            
            // --- CREATE A UNIQUE FINGERPRINT FOR THIS MISTAKE ---
            // We combine the URL + the text of the answer you clicked.
            // span.parentElement is the badge wrapper.
            // span.parentElement.parentElement should be the Answer Button itself.
            // We grab that text (e.g., "Option B: 50kg") to identify this specific mistake.
            
            const answerText = span.parentElement && span.parentElement.parentElement 
                             ? span.parentElement.parentElement.innerText 
                             : "unknown_answer";
                             
            const mistakeID = window.location.href + " || " + answerText;

            // --- THE CHECK ---
            // If this mistakeID is NOT in our memory, play the sound.
            if (!playedMistakes.has(mistakeID)) {
                
                const faahSound = new Audio(chrome.runtime.getURL("faah.mp3"));
                faahSound.play().catch(e => console.log(e));
                
                // Add this mistake to our memory so we never play it again
                playedMistakes.add(mistakeID);
            }
        }
    });
});

// Start watching the page
observer.observe(document.body, { childList: true, subtree: true });