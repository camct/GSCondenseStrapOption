Ecwid.OnAPILoaded.add(function() {
    Ecwid.OnPageLoaded.add(function(page) {
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
                dropdownButton.innerHTML = `
                    <span>${defaultOption.labels[0].textContent}${priceText}</span>
                    <svg class="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8">
                        <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                `;
                console.log('Dropdown button created with text:', defaultOption.labels[0].textContent);

                // Inside your initializeDropdown function, after creating the dropdownButton
                function updateDropdownStyles() {
                    const basketColorOption = document.querySelector('.details-product-option--Basket-Color .product-details-module__content');
                    if (basketColorOption) {
                        // Get the computed styles
                        const basketStyles = window.getComputedStyle(basketColorOption);
                        
                        // Apply only layout styles, preserve button appearance
                        dropdownButton.style.width = basketStyles.width;
                        dropdownButton.style.minHeight = basketStyles.minHeight;
                        dropdownButton.style.padding = basketStyles.padding;
                        dropdownButton.style.margin = basketStyles.margin;
                        
                        // Ensure button styling remains
                        dropdownButton.style.display = 'flex';
                        dropdownButton.style.justifyContent = 'space-between';
                        dropdownButton.style.alignItems = 'center';
                        dropdownButton.style.cursor = 'pointer';
                        dropdownButton.style.border = '1px solid #99c2ff';
                        dropdownButton.style.borderRadius = '4px';
                        dropdownButton.style.backgroundColor = '#fbfbfb';
                        
                        console.log('Updated basket styles while preserving functionality');
                    }
                }

                // Initial style application
                updateDropdownStyles();

                // Create a ResizeObserver to watch for size changes
                const resizeObserver = new ResizeObserver(entries => {
                    console.log('Size changed, updating styles');
                    updateDropdownStyles();
                });

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

                // Cleanup function
                function cleanup() {
                    resizeObserver.disconnect();
                    window.removeEventListener('resize', updateDropdownStyles);
                }

                // Add cleanup when page changes
                Ecwid.OnPageLoaded.add(function(page) {
                    if (page.type !== 'PRODUCT') {
                        cleanup();
                    }
                });

                // Insert after option-title
                optionTitle.parentNode.insertBefore(dropdownButton, optionTitle.nextSibling);
                console.log('Dropdown button inserted into DOM');

                // Modified radio button handling
                function setupRadioListeners() {
                    const radioButtons = optionContent.querySelectorAll('input[type="radio"][name="Strap"]');
                    
                    radioButtons.forEach(radio => {
                        // Remove any existing listeners first
                        const newRadio = radio.cloneNode(true);
                        radio.parentNode.replaceChild(newRadio, radio);
                        
                        newRadio.addEventListener('change', (e) => {
                            console.log('Radio button changed:', e.target.value);
                            if (e.target.checked) {
                                const formControl = e.target.closest('.form-control');
                                const label = formControl.querySelector('label span:first-child');
                                const priceElement = formControl.querySelector('.option-surcharge__value');
                                
                                const selectedText = label ? label.textContent : e.target.value;
                                const priceText = priceElement ? 
                                    ` (${priceElement.textContent})` : '';
                                
                                // Update dropdown button text
                                dropdownButton.querySelector('span').textContent = `${selectedText}${priceText}`;
                                
                                // Close dropdown - match the properties from click handler
                                console.log('Closing dropdown after selection');
                                optionContent.style.visibility = 'hidden';
                                optionContent.style.maxHeight = '0';
                                optionContent.style.overflow = 'hidden';
                                dropdownButton.classList.remove('active');
                                
                                console.log('Dropdown closed after selection');
                            }
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