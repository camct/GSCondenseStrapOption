Ecwid.OnAPILoaded.add(function() {
    const STRAP_PRICES = {'None': -3, 'Adjustable': 10, 'Fixed': 0, 'mtnStrap': 19.99};
    let currentResizeObserver = null;
    let currentDropdownButton = null;
    let currentUpdateDropdownStyles = null;

    // Cleanup function at top level
    function cleanup() {
        if (currentResizeObserver) {
            currentResizeObserver.disconnect();
        }

        if (currentUpdateDropdownStyles) {
            window.removeEventListener('resize', currentUpdateDropdownStyles);
        }
        
        if (currentDropdownButton && currentDropdownButton.parentNode) {
            currentDropdownButton.parentNode.removeChild(currentDropdownButton);
        }
    }

    Ecwid.OnPageLoaded.add(function(page) {
        cleanup();
        if (page.type === 'PRODUCT') {
            console.log('Page loaded, current product ID:', page.productId);
            
            const productIds = [707439498, 707449474, 707449472, 707464855, 707464853];
            
            // Check if the current product ID is in the allowed list
            if (!productIds.includes(page.productId)) {
                console.log('Product ID not in allowed list, exiting');
                return;
            }
            console.log('Product ID found in allowed list');

            // Function to initialize the dropdown
            function initializeDropdown() {
                const option = document.querySelector('.details-product-option--Strap');
                if (!option) {
                    console.log('Strap option not found, retrying...');
                    setTimeout(initializeDropdown, 500); // Retry after 500ms
                    return;
                }
                console.log('Found strap option:', option);
                
                const optionTitle = option.querySelector('.details-product-option__title');
                const optionContent = option.querySelector('.product-details-module__content');
                if (!optionTitle || !optionContent) {
                    console.log('Title or content not found, retrying...');
                    setTimeout(initializeDropdown, 500);
                    return;
                }
                console.log('Found title and content:', { optionTitle, optionContent });

                // Store the original maxHeight only if it's explicitly set
                const hasOriginalMaxHeight = optionContent.style.maxHeight !== '';
                const originalMaxHeight = hasOriginalMaxHeight ? optionContent.style.maxHeight : null;
                console.log('Original maxHeight:', originalMaxHeight);

                // Add dynamic CSS styles to optionContent
                optionContent.style.visibility = 'hidden';
                optionContent.style.maxHeight = '0';
                optionContent.style.overflow = 'hidden';
                optionContent.style.transition = 'all 0.3s ease-in-out';

                // Find the currently selected radio button
                const defaultOption = optionContent.querySelector('input[type="radio"][name="Strap"]:checked') || 
                                    optionContent.querySelector('input[type="radio"][name="Strap"]');  // fallback to first option if none selected
                if (defaultOption) {
                    console.log('Default option found:', defaultOption.value);
                    defaultOption.checked = true;
                    console.log('Default option set to checked');
                } else {
                    console.log('Warning: No radio buttons found');
                }

                // Create dropdown button with selected value and price
                const defaultFormControl = defaultOption.closest('.form-control');
                const defaultPriceElement = defaultFormControl.querySelector('.option-surcharge__value');
                const priceText = defaultPriceElement ? 
                    ` (${defaultPriceElement.textContent})` : '';  // Include brackets in format
                
                const dropdownButton = document.createElement('button');
                dropdownButton.className = 'strap-dropdown-toggle';

                // Create span for text
                const textSpan = document.createElement('span');
                textSpan.textContent = `${defaultOption.labels[0].textContent}${priceText}`;

                // Create SVG element programmatically
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("class", "dropdown-arrow");
                svg.setAttribute("width", "12");
                svg.setAttribute("height", "8");
                svg.setAttribute("viewBox", "0 0 12 8");

                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", "M1 1L6 6L11 1");
                path.setAttribute("stroke", "currentColor");
                path.setAttribute("stroke-width", "2");
                path.setAttribute("fill", "none");

                svg.appendChild(path);
                dropdownButton.appendChild(textSpan);
                dropdownButton.appendChild(svg);

                // Add debugging right after creating the button
                console.log('Button HTML:', dropdownButton.innerHTML);
                console.log('SVG element:', dropdownButton.querySelector('svg'));
                console.log('SVG computed styles:', window.getComputedStyle(dropdownButton.querySelector('svg')));

                // Add a small delay to check if SVG is rendered
                setTimeout(() => {
                    const arrow = dropdownButton.querySelector('.dropdown-arrow');
                    if (arrow) {
                        console.log('Arrow after delay:', {
                            width: arrow.offsetWidth,
                            height: arrow.offsetHeight,
                            display: window.getComputedStyle(arrow).display,
                            visibility: window.getComputedStyle(arrow).visibility
                        });
                    } else {
                        console.log('Arrow not found after delay');
                    }
                }, 100);

                // After creating the dropdownButton
                console.log('Dropdown arrow element:', dropdownButton.querySelector('.dropdown-arrow'));
                console.log('Dropdown arrow path:', dropdownButton.querySelector('.dropdown-arrow path'));
                console.log('Dropdown button created with text:', defaultOption.labels[0].textContent);

                // Inside your initializeDropdown function, after creating the dropdownButton
                function updateDropdownStyles() {
                    const basketColorOption = document.querySelector('.details-product-option--Basket-Color .product-details-module__content');
                    if (basketColorOption) {
                        const basketStyles = window.getComputedStyle(basketColorOption);
                        
                        // Only keep width/height matching
                        dropdownButton.style.width = basketStyles.width;
                        dropdownButton.style.minHeight = basketStyles.minHeight;
                        dropdownButton.style.margin = basketStyles.margin;
                        
                        console.log('Updated basket styles while preserving functionality');
                    }
                }

                // Initial style application
                updateDropdownStyles();

                currentUpdateDropdownStyles = updateDropdownStyles;

                // Create a ResizeObserver to watch for size changes
                const resizeObserver = new ResizeObserver(entries => {
                    console.log('Size changed, updating styles');
                    updateDropdownStyles();
                });
                
                currentResizeObserver = resizeObserver;
                currentDropdownButton = dropdownButton;

                // Watch both the basket color option and its parent container
                const basketColorOption = document.querySelector('.details-product-option--Basket-Color .product-details-module__content');
                if (basketColorOption) {
                    resizeObserver.observe(basketColorOption);
                    resizeObserver.observe(basketColorOption.parentElement);
                }

                // Also watch for window resize events as a fallback
                window.addEventListener('resize', () => {
                    requestAnimationFrame(updateDropdownStyles);
                });

                // Insert after option-title
                optionTitle.parentNode.insertBefore(dropdownButton, optionTitle.nextSibling);
                console.log('Dropdown button inserted into DOM');

                function setupRadioListeners() {
                    const radioButtons = optionContent.querySelectorAll('input[type="radio"][name="Strap"]');
                    
                    radioButtons.forEach(radio => {
                        // Remove existing listeners
                        const newRadio = radio.cloneNode(true);
                        radio.parentNode.replaceChild(newRadio, radio);
                        
                        newRadio.addEventListener('change', (e) => {
                            console.log('Strap radio changed:', e.target.value);
                            
                            // Update dropdown UI
                            const formControl = e.target.closest('.form-control');
                            const label = formControl.querySelector('label span:first-child');
                            const priceElement = formControl.querySelector('.option-surcharge__value');
                            
                            const selectedText = label ? label.textContent : e.target.value;
                            const priceText = priceElement ? ` (${priceElement.textContent})` : '';
                            
                            // Update dropdown button text
                            dropdownButton.querySelector('span').textContent = `${selectedText}${priceText}`;
                            
                            // Close dropdown
                            optionContent.style.visibility = 'hidden';
                            optionContent.style.maxHeight = '0';
                            optionContent.style.overflow = 'hidden';
                            dropdownButton.classList.remove('active');
                            
                            // Normalize the strap value for price lookup
                            const strapValue = e.target.value;
    
                            // If it's not one of the standard options, it must be mtnStrap
                            const normalizedValue = ['Adjustable', 'Fixed', 'None'].includes(strapValue) 
                                ? strapValue 
                                : 'mtnStrap';
                            
                            const strapChangeEvent = new CustomEvent('strapOptionChanged', {
                                detail: {
                                    value: strapValue,  // Keep original value for display
                                    price: STRAP_PRICES[normalizedValue] || 0  // Use normalized value for price
                                },
                                bubbles: true
                            });
                            
                            console.log('Dispatching strap change event:', {
                                originalValue: strapValue,
                                normalizedValue: normalizedValue,
                                price: STRAP_PRICES[normalizedValue]
                            });
                            
                            e.target.dispatchEvent(strapChangeEvent);
                        });
                    });
                }

                // Initial setup of radio listeners
                setupRadioListeners();
                
                // Also setup listeners when dropdown is opened (in case of dynamic content)
                dropdownButton.addEventListener('click', () => {
                    console.log('Button clicked');
                    const isActive = dropdownButton.classList.contains('active');
                    console.log('Current state:', {
                        isActive,
                        visibility: optionContent.style.visibility,
                        maxHeight: optionContent.style.maxHeight
                    });
                    
                    if (!isActive) {
                        setTimeout(setupRadioListeners, 100);
                    }
                    
                    // Toggle visibility and height
                    if (isActive) {
                        console.log('Closing dropdown');
                        optionContent.style.visibility = 'hidden';
                        optionContent.style.maxHeight = '0';
                        optionContent.style.overflow = 'hidden';
                        dropdownButton.classList.remove('active');
                    } else {
                        console.log('Opening dropdown');
                        optionContent.style.visibility = 'visible';
                        optionContent.style.maxHeight = 'none';
                        optionContent.style.overflow = 'visible';
                        dropdownButton.classList.add('active');
                    }
                    
                    console.log('Dropdown state after toggle:', {
                        visibility: optionContent.style.visibility,
                        maxHeight: optionContent.style.maxHeight,
                        overflow: optionContent.style.overflow
                    });
                });

                console.log('All event listeners attached');
            }

            // Start the initialization process with a small initial delay
            setTimeout(initializeDropdown, 100);
        }
    });
});