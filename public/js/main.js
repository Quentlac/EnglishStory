document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 EnglishStory app loaded!');

  const submitBtn = document.getElementById('submit-btn');
  const storyInput = document.getElementById('story-input');
  const loader = document.getElementById('loader');
  const resultSection = document.getElementById('result-section');
  const responseContainer = document.getElementById('response');
  const gaugeFill = document.getElementById('gauge-fill');
  const gaugeValue = document.getElementById('gauge-value');
  const trophy = document.getElementById('trophy');
  const trophyLabel = document.getElementById('trophy-label');
  const trophyContainer = document.getElementById('trophy-container');

  function updateGauge(mark) {
    // Animate gauge fill
    gaugeFill.style.width = `${mark}%`;
    
    // Animate counter
    let current = 0;
    const duration = 1500;
    const step = mark / (duration / 16);
    
    const counter = setInterval(() => {
      current += step;
      if (current >= mark) {
        current = mark;
        clearInterval(counter);
      }
      gaugeValue.textContent = `${Math.round(current)}/100`;
    }, 16);

    // Update gauge color based on score
    if (mark >= 90) {
      gaugeFill.style.background = 'linear-gradient(90deg, #667eea 0%, #ffd700 100%)';
    } else if (mark >= 75) {
      gaugeFill.style.background = 'linear-gradient(90deg, #667eea 0%, #c0c0c0 100%)';
    } else if (mark >= 50) {
      gaugeFill.style.background = 'linear-gradient(90deg, #667eea 0%, #cd7f32 100%)';
    } else {
      gaugeFill.style.background = 'linear-gradient(90deg, #e74c3c 0%, #c0392b 100%)';
    }
  }

  function updateTrophy(mark) {
    if (mark >= 90) {
      trophyContainer.className = 'trophy-container gold';
      trophyLabel.textContent = 'Gold';
    } else if (mark >= 75) {
      trophyContainer.className = 'trophy-container silver';
      trophyLabel.textContent = 'Silver';
    } else if (mark >= 50) {
      trophyContainer.className = 'trophy-container bronze';
      trophyLabel.textContent = 'Bronze';
    } else {
      trophyContainer.className = 'trophy-container none';
      trophyLabel.textContent = 'No medal';
    }
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const text = storyInput.value.trim();
      
      if (!text) {
        alert('Please write something in the text area first!');
        return;
      }

      // Show loader, hide result
      loader.style.display = 'flex';
      resultSection.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';

      try {
        const response = await fetch('/api/thinking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });

        const data = await response.json();
        
        // Hide loader, show result
        loader.style.display = 'none';
        resultSection.style.display = 'block';
        
        // Update gauge and trophy
        const mark = data.mark || 0;
        updateGauge(mark);
        updateTrophy(mark);
        
        // Update story
        responseContainer.innerHTML = `<p>${data.story}</p>`;
        
      } catch (error) {
        console.error('Error:', error);
        loader.style.display = 'none';
        resultSection.style.display = 'block';
        responseContainer.innerHTML = `<p class="error">An error occurred. Please try again.</p>`;
      } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    });
  }
});
