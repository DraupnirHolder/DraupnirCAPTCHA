document.addEventListener('DOMContentLoaded', () => {
    const figuresContainer = document.getElementById('captcha-figures');
    const optionsContainer = document.getElementById('captcha-options');
    const successMessage = document.getElementById('success-message');
    const captchaContainer = document.getElementById('captcha-container');

    const figureTypes = ['circle', 'triangle', 'square', 'pentagon', 'hexagon', 'star', 'diamond'];
    let selectedFigures = [];
    let requiredOrder = [];

    function generateRandomTransformation() {
        const skewX = Math.floor(Math.random() * 30) - 15;
        const skewY = Math.floor(Math.random() * 30) - 15;
        const scaleX = Math.random() * 0.5 + 0.75;
        const scaleY = Math.random() * 0.5 + 0.75;
        const rotate = Math.floor(Math.random() * 45) - 22.5;
        return `skew(${skewX}deg, ${skewY}deg) scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`;
    }

    function generateSVG(figureType, addNoise = false) {
        let svg;
        switch (figureType) {
            case 'circle':
                svg = '<svg width="50" height="50"><circle cx="25" cy="25" r="20" fill="blue"/></svg>';
                break;
            case 'triangle':
                svg = '<svg width="50" height="50"><polygon points="25,5 45,45 5,45" fill="green"/></svg>';
                break;
            case 'square':
                svg = '<svg width="50" height="50"><rect width="40" height="40" x="5" y="5" fill="red"/></svg>';
                break;
            case 'pentagon':
                svg = '<svg width="50" height="50"><polygon points="25,5 45,20 35,45 15,45 5,20" fill="orange"/></svg>';
                break;
            case 'hexagon':
                svg = '<svg width="50" height="50"><polygon points="25,5 45,15 45,35 25,45 5,35 5,15" fill="purple"/></svg>';
                break;
            case 'star':
                svg = '<svg width="50" height="50"><polygon points="25,5 30,20 45,20 33,30 38,45 25,35 12,45 17,30 5,20 20,20" fill="yellow"/></svg>';
                break;
            case 'diamond':
                svg = '<svg width="50" height="50"><polygon points="25,5 45,25 25,45 5,25" fill="cyan"/></svg>';
                break;
            default:
                break;
        }

        if (addNoise) {
            svg = addNoiseAndLines(svg);
        }

        return svg;
    }

    function addNoiseAndLines(svg) {
      
        const noiseDiv = document.createElement('div');
        noiseDiv.innerHTML = svg;
        noiseDiv.style.position = 'relative';

        const numOfLines = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < numOfLines; i++) {
            const line = document.createElement('div');
            line.style.position = 'absolute';
            line.style.width = '100%';
            line.style.height = '2px';
            line.style.background = 'rgba(0, 0, 0, 0.5)';
            line.style.top = `${Math.random() * 100}%`;
            line.style.transform = `rotate(${Math.random() * 360}deg)`;
            noiseDiv.appendChild(line);
        }

        const noiseIntensity = Math.random() * 0.3 + 0.1; 
        const noiseOverlay = document.createElement('div');
        noiseOverlay.style.position = 'absolute';
        noiseOverlay.style.top = '0';
        noiseOverlay.style.left = '0';
        noiseOverlay.style.width = '100%';
        noiseOverlay.style.height = '100%';
        noiseOverlay.style.background = `rgba(0, 0, 0, ${noiseIntensity})`;
        noiseOverlay.style.pointerEvents = 'none';
        noiseDiv.appendChild(noiseOverlay);
        
        return noiseDiv.innerHTML;
    }
    function generateCaptcha() {
        figuresContainer.innerHTML = '';
        optionsContainer.innerHTML = '';

        const figures = [...figureTypes].sort(() => 0.5 - Math.random()).slice(0, 7);
        requiredOrder = figures.slice(0, 5);
        selectedFigures = []; 

        requiredOrder.forEach((figureType) => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('captcha-sample');
            optionDiv.innerHTML = generateSVG(figureType); 

            optionsContainer.appendChild(optionDiv);
        });

        const shuffledFigures = [...figures].sort(() => 0.5 - Math.random());

        shuffledFigures.forEach((figureType) => {
            const figureDiv = document.createElement('div');
            figureDiv.classList.add('captcha-option');
            figureDiv.innerHTML = generateSVG(figureType, true); 
            figureDiv.style.transform = generateRandomTransformation(); 

    
            figureDiv.addEventListener('mouseover', () => {
                figureDiv.style.transform = `${generateRandomTransformation()} scale(1.2)`;
            });
            figureDiv.addEventListener('mouseout', () => {
                figureDiv.style.transform = generateRandomTransformation(); 
            });

            figureDiv.addEventListener('click', () => {
                handleSelection(figureType, figureDiv);
            });

            figuresContainer.appendChild(figureDiv);
        });
    }

    function handleSelection(figureType, figureDiv) {
        if (selectedFigures.length >= 5) return; 

        selectedFigures.push(figureType); 

        const orderMark = document.createElement('span');
        orderMark.textContent = selectedFigures.length;
        orderMark.style.position = 'absolute';
        orderMark.style.top = '-10px';
        orderMark.style.right = '-10px';
        orderMark.style.fontSize = '20px';
        orderMark.style.color = 'red';
        figureDiv.appendChild(orderMark);

        figureDiv.style.pointerEvents = 'none';

        figureDiv.style.transition = 'opacity 0.5s ease';
        figureDiv.style.opacity = '0';

        setTimeout(() => {
            figureDiv.style.display = 'none'; 
        }, 500);

        if (selectedFigures.length === 5) {
            checkCaptcha();
        }
    }

    
    function checkCaptcha() {
        if (JSON.stringify(selectedFigures) === JSON.stringify(requiredOrder)) {
            successMessage.style.display = 'block';
            captchaContainer.style.animation = 'fadeOut 1s forwards';
            setTimeout(() => {
                window.location.href = 'index3.html'; 
            }, 2000);
        } else {
            alert('Неправильный порядок. Попробуйте снова.');
            generateCaptcha(); 
        }
    }

    generateCaptcha(); 
});