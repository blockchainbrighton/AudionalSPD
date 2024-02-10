// uiHandlers.js

function clearPad(pad) {
    pad.innerHTML = `Pad ${pad.dataset.pad}`; // Reset to default text, e.g., "Pad 1"
    pad.style.pointerEvents = 'auto'; // Re-enable pointer events for loading new content
    delete pad.dataset.loaded; // Remove the loaded attribute
}

function addDeleteButton(pad) {
    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = function(event) {
        event.stopPropagation(); // Prevent triggering pad click
        clearPad(pad);
    };
    pad.appendChild(deleteBtn);
}

function showModal() {
    let modal = document.getElementById('modal');
    if (!modal) {
        modal = createModal();
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
}

function createModal() {
    const modal = document.createElement('div');
    modal.id = 'modal';
    Object.assign(modal.style, {
        position: 'fixed', left: '0', top: '0', width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: '1000'
    });

    const modalContent = document.createElement('div');
    Object.assign(modalContent.style, {
        background: '#fff', padding: '20px', borderRadius: '5px', textAlign: 'center'
    });

    const localButton = document.createElement('button');
    localButton.textContent = 'Load from Local Device';
    localButton.onclick = () => document.getElementById('localFile').click();

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Enter URL';

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load from URL';
    loadButton.onclick = () => {
        loadFromURL(urlInput.value);
        modal.style.display = 'none';
    };

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.onclick = () => modal.style.display = 'none';

    modalContent.append(localButton, urlInput, loadButton, closeButton);
    modal.appendChild(modalContent);
    return modal;
}
