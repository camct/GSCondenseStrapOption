Ecwid.OnAPILoaded.add(function() {
    Ecwid.OnPageLoaded.add(function(page) {
        console.log('Page loaded, current product ID:', page.productId);
        
        const productIds = [55001151, 74102380, 506210440, 570262509, 94782479];
        
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

        // Set default selected item
        const defaultOption = optionContent.querySelector('input[value="Fixed"]');
        console.log('Default option found:', defaultOption);
        defaultOption.checked = true;
        console.log('Default option set to checked');

        // Create dropdown button with selected value
        const dropdownButton = document.createElement('button');
        dropdownButton.className = 'strap-dropdown-toggle';
        dropdownButton.innerHTML = `
            <span>${defaultOption.labels[0].textContent}</span>
            <svg class="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8">
                <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
        `;
        console.log('Dropdown button created');

        // Insert after option-title
        optionTitle.parentNode.insertBefore(dropdownButton, optionTitle.nextSibling);
        console.log('Dropdown button inserted into DOM');

        // Add click handler for dropdown
        dropdownButton.addEventListener('click', () => {
            console.log('Dropdown button clicked');
            optionContent.classList.toggle('expanded');
            dropdownButton.classList.toggle('active');
            console.log('Dropdown state toggled');
        });

        // Add change handler for radio buttons
        const radioButtons = document.querySelectorAll('input[name="strap"]');
        console.log('Found radio buttons:', radioButtons.length);
        
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                console.log('Radio button changed:', e.target.value);
                if (e.target.checked) {
                    const selectedText = e.target.labels[0].textContent;
                    console.log('Selected text:', selectedText);
                    dropdownButton.querySelector('span').textContent = selectedText;
                    // Close dropdown when option is selected
                    optionContent.classList.remove('expanded');
                    dropdownButton.classList.remove('active');
                    console.log('Dropdown closed after selection');
                }
            });
        });
        
        console.log('All event listeners attached');
    });
});