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

            // Create and insert the dropdown toggle button
            const option = document.querySelector('.details-product-option--Strap');
            console.log('Found strap option:', option);
            
            const optionTitle = option.querySelector('.details-product-option__title');
            const optionContent = option.querySelector('.product-details-module__content');
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
            console.log('Dropdown button created');

            // After creating the dropdown button but before inserting it
            const basketColorOption = document.querySelector('.details-product-option--Basket-Color .product-details-module__content');
            if (basketColorOption) {
                // Get the computed styles
                const basketStyles = window.getComputedStyle(basketColorOption);
                
                // Apply relevant styles only
                dropdownButton.style.width = basketStyles.width;
                dropdownButton.style.padding = basketStyles.padding;
                dropdownButton.style.margin = basketStyles.margin;
                dropdownButton.style.borderRadius = basketStyles.borderRadius;
                dropdownButton.style.backgroundColor = basketStyles.backgroundColor;
                dropdownButton.style.border = basketStyles.border;
                dropdownButton.style.fontSize = basketStyles.fontSize;
                dropdownButton.style.fontFamily = basketStyles.fontFamily;
                
                // Log for debugging
                console.log('Applied basket styles:', {
                    width: basketStyles.width,
                    padding: basketStyles.padding,
                    margin: basketStyles.margin,
                    borderRadius: basketStyles.borderRadius,
                    backgroundColor: basketStyles.backgroundColor,
                    border: basketStyles.border,
                    fontSize: basketStyles.fontSize,
                    fontFamily: basketStyles.fontFamily
                });
            }

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
                            const label = formControl.querySelector('label span:first-child');  // Get first span (name)
                            const priceElement = formControl.querySelector('.option-surcharge__value');
                            
                            // Get the text and price (if it exists)
                            const selectedText = label ? label.textContent : e.target.value;
                            const priceText = priceElement ? 
                                ` (${priceElement.textContent})` : '';  // Include brackets in format
                            
                            // Update dropdown button text
                            dropdownButton.querySelector('span').textContent = `${selectedText}${priceText}`;
                            
                            // Close dropdown
                            optionContent.style.visibility = 'hidden';
                            optionContent.style.maxHeight = '0';
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
                console.log('Dropdown button clicked');
                const isActive = dropdownButton.classList.contains('active');
                
                if (!isActive) {
                    setTimeout(setupRadioListeners, 100);
                }
                
                // Toggle visibility and height
                if (isActive) {
                    optionContent.style.visibility = 'hidden';
                    optionContent.style.maxHeight = '0';
                    dropdownButton.classList.remove('active');
                } else {
                    optionContent.style.visibility = 'visible';
                    // Only set maxHeight if it originally existed
                    if (hasOriginalMaxHeight) {
                        optionContent.style.maxHeight = originalMaxHeight;
                    } else {
                        optionContent.style.removeProperty('maxHeight');  // Properly removes the style
                    }
                    dropdownButton.classList.add('active');
                }
                
                console.log('Dropdown state toggled');
            });

            console.log('All event listeners attached');
        }
    });
});