/**
 * Starfield Background Animation
 * Creates animated starfield background
 */

function initStarfield() {
  try {
    const canvas = document.getElementById('starfield');
    if (!canvas) {
      console.warn('Starfield canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    let stars = [];
    const STAR_COUNT = 120;

    /**
     * Resize canvas to window size
     */
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }

    /**
     * Initialize stars array
     */
    function initStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.2 + 0.3,
          a: Math.random() * 0.6 + 0.1,
          d: Math.random() * 0.0003 + 0.0001,
          p: Math.random() * Math.PI * 2
        });
      }
    }

    /**
     * Draw and animate stars
     */
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        s.p += s.d;
        const alpha = s.a * (0.5 + 0.5 * Math.sin(s.p * 1000));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener('resize', resize);
  } catch (err) {
    console.error('Starfield error:', err);
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initStarfield);
