Ecwid.OnAPILoaded.add(function() {
    Ecwid.OnPageLoaded.add(function(page) {
        const productIds = [55001151, 74102380, 506210440, 570262509, 94782479];
  
        // Check if the current product ID is in the allowed list
        if (!productIds.includes(page.productId)) {return;}

        // Create and insert the dropdown toggle button
        const option = document.querySelector('.details-product-option--Strap');
        const optionTitle = option.querySelector('.details-product-option__title');
        const optionContent = option.querySelector('.product-details-module__content');

        // Set default selected item
        const defaultOption = optionContent.querySelector('input[value="Fixed"]');
        defaultOption.checked = true;

        // Create dropdown button with selected value
        const dropdownButton = document.createElement('button');
        dropdownButton.className = 'strap-dropdown-toggle';
        dropdownButton.innerHTML = `
            <span>${defaultOption.labels[0].textContent}</span>
            <svg class="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8">
                <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
        `;

        // Insert after option-title
        optionTitle.parentNode.insertBefore(dropdownButton, optionTitle.nextSibling);

        // Add click handler for dropdown
        dropdownButton.addEventListener('click', () => {
            optionContent.classList.toggle('expanded');
            dropdownButton.classList.toggle('active');
        });

        // Add change handler for radio buttons
        const radioButtons = document.querySelectorAll('input[name="strap"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    const selectedText = e.target.labels[0].textContent;
                    dropdownButton.querySelector('span').textContent = selectedText;
                    // Close dropdown when option is selected
                    optionContent.classList.remove('expanded');
                    dropdownButton.classList.remove('active');
                }
            });
        });
    });
});