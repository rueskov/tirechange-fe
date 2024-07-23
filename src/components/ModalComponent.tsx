import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../styles/modal.css'; // Import the CSS for modal

interface ModalComponentProps {
  showModal: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  contactInformation: string;
  setContactInformation: (value: string) => void;
  successMessage: string;
  errorMessage: string;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  showModal,
  handleClose,
  handleSubmit,
  contactInformation,
  setContactInformation,
  successMessage,
  errorMessage,
}) => {
  if (!showModal) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Book appointment</h2>
        </div>
        <div>
          {successMessage ? (
            <>
              <p className="success-message">{successMessage}</p> {/* Display success message */}
              <button className="close-button" onClick={handleClose}>Close</button>
            </>
          ) : (
            <>
              <label htmlFor="contact-info">Contact Information:</label>
              <PhoneInput
                country={'us'}
                value={contactInformation}
                onChange={setContactInformation}
                inputProps={{
                  name: 'contact-info',
                  required: true,
                  autoFocus: true
                }}
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
            </>
          )}
        </div>
        {!successMessage && (
          <div className="modal-footer">
            <button onClick={handleClose}>Cancel</button>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalComponent;
