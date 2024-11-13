Ecwid.OnAPILoaded.add(function() {
    Ecwid.OnPageLoaded.add(function(page) {
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

        // Initially hide the option content
        optionContent.style.visibility = 'hidden';

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
                        optionContent.classList.remove('expanded');
                        optionContent.style.visibility = 'hidden';
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
            const isExpanded = optionContent.classList.contains('expanded');
            
            if (!isExpanded) {
                // Setup radio listeners again when opening dropdown
                setTimeout(setupRadioListeners, 100);
            }
            
            // Toggle visibility
            if (isExpanded) {
                optionContent.classList.remove('expanded');
                optionContent.style.visibility = 'hidden';
                dropdownButton.classList.remove('active');
            } else {
                optionContent.style.visibility = 'visible';
                optionContent.classList.add('expanded');
                dropdownButton.classList.add('active');
            }
            
            console.log('Dropdown state toggled');
        });

        console.log('All event listeners attached');
    });
});