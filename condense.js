Ecwid.OnAPILoaded.add(function() {
    const STRAP_PRICES = {'None': -3, 'Adjustable': 10, 'Fixed': 0, 'mtnStrap': 19.99};
    // Strap images data embedded in the script
    const STRAP_IMAGES = {
        "Salida Magic": "https://v2uploads.zopim.io/3/e/F/3eFaiNrwYkfEtd5mb7bCEBxsvUWHUH4R/11473b8440ac88cdd06789823e08511768ecac35.png",
        "Wasatch Front": "https://v2uploads.zopim.io/3/e/F/3eFaiNrwYkfEtd5mb7bCEBxsvUWHUH4R/aaaf04823849ce69bb21158001fe2bc909ed60ad.png",
        "Autumn": "https://v2uploads.zopim.io/3/e/F/3eFaiNrwYkfEtd5mb7bCEBxsvUWHUH4R/f2ad194c3b2b26091a5cce7ba258d4e2779b1dc7.png",
        "Bridgers": "https://v2uploads.zopim.io/3/e/F/3eFaiNrwYkfEtd5mb7bCEBxsvUWHUH4R/f5903867c8640bb53b5aab87e5468e9099087ac3.png",
        "Mount Tam": "https://v2uploads.zopim.io/3/e/F/3eFaiNrwYkfEtd5mb7bCEBxsvUWHUH4R/cfb0b1dcd7fa27eeeb9531cafc773f39fd53e8b2.png",
        "Flow": "https://v2uploads.zopim.io/3/e/F/3eFaiNrwYkfEtd5mb7bCEBxsvUWHUH4R/3586dac16e7ae760735b39966514b7ac4142c629.png",
        "Idaho 9": "https://v2uploads.zopim.io/3/e/F/3eFaiNrwYkfEtd5mb7bCEBxsvUWHUH4R/fac842e98aa70987445710d32d903a83d4e491e5.png",
        "Dark Side": "https://v2uploads.zopim.io/3/e/F/3eFaiNrwYkfEtd5mb7bCEBxsvUWHUH4R/e5f95d4c13928f6dad040e4473e1e5ee94394c0e.png",
        "Lone Peak": "https://v2uploads.zopim.io/3/e/F/3eFaiNrwYkfEtd5mb7bCEBxsvUWHUH4R/8f612d42e4877ec6535aadaf327636628411afcd.png",
        "Teton": "https://v2uploads.zopim.io/3/e/F/3eFaiNrwYkfEtd5mb7bCEBxsvUWHUH4R/50b9b3081acc108626749805f63893d7228b26ad.png",
        "The Grand": "https://v2uploads.zopim.io/3/e/F/3eFaiNrwYkfEtd5mb7bCEBxsvUWHUH4R/5b0ae3f0d2be85eb8f907c1205b0aedaef5d6084.png",
        "Spanish Peaks": "https://v2uploads.zopim.io/3/e/F/3eFaiNrwYkfEtd5mb7bCEBxsvUWHUH4R/fc10b4558a9db9928e6dc9e5a079ea4ec230d8af.png",
        "Mary Jane": "https://v2uploads.zopim.io/3/e/F/3eFaiNrwYkfEtd5mb7bCEBxsvUWHUH4R/1cc7def11bdedfbe45185ee299995a6e36719d43.png",
        "Purple-Haze": "https://v2uploads.zopim.io/3/e/F/3eFaiNrwYkfEtd5mb7bCEBxsvUWHUH4R/6cb063dc3114e43e8d267cda4134d1b26ce97787.png",
        "Just Point It - Zia": "https://v2uploads.zopim.io/3/e/F/3eFaiNrwYkfEtd5mb7bCEBxsvUWHUH4R/2fcd0c0d39c6bfd9b4389befe417ae9dbc8228a1.png",
        "Lone 2": "https://i.ibb.co/0yM4vrm/Lone-2.png",
        "Sacagawea": "https://i.ibb.co/RYML6RB/Sacagawea.png",
        "Fixed": "https://i.ibb.co/ZHQ6bmV/fixed.jpg",
        "Adjustable": "https://i.ibb.co/3Rp9vLm/adjustable.jpg",
        "Fantasia": "https://i.ibb.co/LhC46k9R/fantasia-Strap-Edites.png"
    };
    
    let currentResizeObserver = null;
    let currentDropdownButton = null;
    let currentUpdateDropdownStyles = null;
    
    // Preload all strap images when script loads
    function preloadStrapImages() {
        const imagePromises = [];
        for (const [key, url] of Object.entries(STRAP_IMAGES)) {
            const img = new Image();
            const promise = new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = resolve; // Resolve even on error to not block other images
            });
            img.src = url;
            imagePromises.push(promise);
        }
        Promise.all(imagePromises).then(() => {
            console.log('All strap images preloaded');
        });
    }
    
    // Start preloading images immediately
    preloadStrapImages();

    // Cleanup function at top level
    function cleanup() {
        if (currentResizeObserver) {
            currentResizeObserver.disconnect();
            currentResizeObserver = null;
        }

        if (currentUpdateDropdownStyles) {
            window.removeEventListener('resize', currentUpdateDropdownStyles);
            currentUpdateDropdownStyles = null;
        }
        
        // Remove all existing dropdown buttons
        const existingDropdowns = document.querySelectorAll('.strap-dropdown-toggle');
        existingDropdowns.forEach(dropdown => {
            if (dropdown.parentNode) {
                dropdown.parentNode.removeChild(dropdown);
            }
        });
        
        // Reset the current button reference
        currentDropdownButton = null;
    }

    Ecwid.OnPageLoaded.add(function(page) {
        cleanup();
        if (page.type === 'PRODUCT') {
            console.log('Page loaded, current product ID:', page.productId);
            
            const productIds = [707439498, 707449474, 707449472, 707464855, 707464853];
            
            // Check if the current product ID is  in the allowed list
            if (!productIds.includes(page.productId)) {
                console.log('Product ID not in allowed list, exiting');
                return;
            }
            console.log('Product ID found in allowed list');

            // Function to initialize the dropdown
            function initializeDropdown() {
                if (document.querySelector('.strap-dropdown-toggle')) {
                    console.log('Dropdown already exists, exiting');
                    return;
                }
                
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
                optionContent.style.visibility = 'visible';
                optionContent.style.maxHeight = 'none';
                optionContent.style.overflow = 'visible';
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
                    defaultPriceElement.textContent : '';  // Price text without brackets
                
                const dropdownButton = document.createElement('button');
                dropdownButton.className = 'strap-dropdown-toggle';

                // Create span for content (image and price)
                const contentSpan = document.createElement('span');
                contentSpan.className = 'strap-dropdown-text';
                
                const strapValue = defaultOption.value;
                
                // Create image element if image exists
                if (STRAP_IMAGES[strapValue]) {
                    const strapImage = document.createElement('img');
                    strapImage.className = 'strap-dropdown-image';
                    strapImage.src = STRAP_IMAGES[strapValue];
                    strapImage.alt = strapValue;
                    contentSpan.appendChild(strapImage);
                } else {
                    // Fallback to text if image not found
                    const textNode = document.createTextNode(strapValue);
                    contentSpan.appendChild(textNode);
                }
                
                // Create price span
                if (priceText) {
                    const priceSpan = document.createElement('span');
                    priceSpan.className = 'strap-dropdown-price';
                    priceSpan.textContent = priceText;
                    contentSpan.appendChild(priceSpan);
                }

                // Update the SVG
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("class", "strap-dropdown-arrow");
                svg.setAttribute("width", "12");
                svg.setAttribute("height", "12");
                svg.setAttribute("viewBox", "0 0 12 12");
                svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", "M11 4L6 9 1 4");
                path.setAttribute("fill", "none");
                path.setAttribute("fill-rule", "evenodd");
                path.setAttribute("stroke", "currentColor");
                path.setAttribute("stroke-width", "1");
                path.setAttribute("stroke-linecap", "round");
                path.setAttribute("stroke-linejoin", "round");

                svg.appendChild(path);
                dropdownButton.appendChild(contentSpan);

                // Ensure SVG is added and visible
                dropdownButton.appendChild(svg);

                // Force a repaint
                requestAnimationFrame(() => {
                    svg.style.display = "block";
                    svg.style.visibility = "visible";
                });

                // Add debugging right after creating the button
                console.log('Button HTML:', dropdownButton.innerHTML);
                console.log('SVG element:', dropdownButton.querySelector('svg'));
                console.log('SVG computed styles:', window.getComputedStyle(dropdownButton.querySelector('svg')));

                // Add a small delay to check if SVG is rendered
                setTimeout(() => {
                    const arrow = dropdownButton.querySelector('.strap-dropdown-arrow');
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
                console.log('Dropdown arrow element:', dropdownButton.querySelector('.strap-dropdown-arrow'));
                console.log('Dropdown arrow path:', dropdownButton.querySelector('.strap-dropdown-arrow path'));
                console.log('Dropdown button created with strap:', strapValue);

                // Inside your initializeDropdown function, after creating the dropdownButton
                function updateDropdownStyles() {
                    const basketColorOption = document.querySelector('.details-product-option--Basket-Color .product-details-module__content');
                    if (basketColorOption) {
                        const basketStyles = window.getComputedStyle(basketColorOption);
                        
                        // Only copy width and margin
                        dropdownButton.style.width = basketStyles.width;
                        dropdownButton.style.margin = basketStyles.margin;
                        
                        console.log('Button computed styles after update:', window.getComputedStyle(dropdownButton));
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
                
                // Set the dropdown as active since it starts expanded
                dropdownButton.classList.add('active');
                // Hide the dropdown button while radios are visible
                dropdownButton.style.display = 'none';
                
                console.log('Dropdown button inserted into DOM');

                function setupRadioListeners() {
                    const radioButtons = optionContent.querySelectorAll('input[type="radio"][name="Strap"]');
                    
                    radioButtons.forEach(radio => {
                        // Remove existing listeners and clone the radio button
                        const newRadio = radio.cloneNode(true);
                        radio.parentNode.replaceChild(newRadio, radio);
                        
                        newRadio.addEventListener('change', (e) => {
                            console.log('Strap radio changed:', e.target.value);
                            
                            // Update dropdown UI
                            const formControl = e.target.closest('.form-control');
                            const priceElement = formControl.querySelector('.option-surcharge__value');
                            
                            // Use the radio button's value directly
                            const selectedValue = e.target.value;
                            const priceText = priceElement ? priceElement.textContent : '';
                            
                            // Update the content span (image and price)
                            const contentSpan = dropdownButton.querySelector('.strap-dropdown-text');
                            const existingImage = contentSpan.querySelector('.strap-dropdown-image');
                            const existingPrice = contentSpan.querySelector('.strap-dropdown-price');
                            
                            // Remove any direct text nodes (not in child elements)
                            Array.from(contentSpan.childNodes).forEach(node => {
                                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                                    node.remove();
                                }
                            });
                            
                            // Update or create image
                            if (STRAP_IMAGES[selectedValue]) {
                                if (existingImage) {
                                    existingImage.src = STRAP_IMAGES[selectedValue];
                                    existingImage.alt = selectedValue;
                                    existingImage.style.display = '';
                                } else {
                                    const strapImage = document.createElement('img');
                                    strapImage.className = 'strap-dropdown-image';
                                    strapImage.src = STRAP_IMAGES[selectedValue];
                                    strapImage.alt = selectedValue;
                                    contentSpan.insertBefore(strapImage, existingPrice || null);
                                }
                            } else {
                                // Show text if no image
                                if (existingImage) {
                                    existingImage.style.display = 'none';
                                }
                                // Add text node before price if it exists, otherwise just append
                                const textNode = document.createTextNode(selectedValue);
                                if (existingPrice) {
                                    contentSpan.insertBefore(textNode, existingPrice);
                                } else {
                                    contentSpan.appendChild(textNode);
                                }
                            }
                            
                            // Update or create price
                            if (priceText) {
                                if (existingPrice) {
                                    existingPrice.textContent = priceText;
                                } else {
                                    const priceSpan = document.createElement('span');
                                    priceSpan.className = 'strap-dropdown-price';
                                    priceSpan.textContent = priceText;
                                    contentSpan.appendChild(priceSpan);
                                }
                            } else if (existingPrice) {
                                existingPrice.remove();
                            }
                            
                            // Close dropdown
                            optionContent.style.visibility = 'hidden';
                            optionContent.style.maxHeight = '0';
                            optionContent.style.overflow = 'hidden';
                            dropdownButton.classList.remove('active');
                            // Show the dropdown button again after selection
                            dropdownButton.style.display = '';
                            
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
                        // Show the dropdown button when radios are hidden
                        dropdownButton.style.display = '';
                    } else {
                        console.log('Opening dropdown');
                        optionContent.style.visibility = 'visible';
                        optionContent.style.maxHeight = 'none';
                        optionContent.style.overflow = 'visible';
                        dropdownButton.classList.add('active');
                        // Hide the dropdown button when radios are visible
                        dropdownButton.style.display = 'none';
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