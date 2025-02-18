import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useEffect, useState } from 'react';

const Dicionario = ({ toggle, modal, children}) => {
    return (
        <Modal isOpen={modal} toggle={toggle} className="modal-lg">
            <ModalHeader toggle={toggle}>Editar palavra</ModalHeader>
            <ModalBody>
                {children}
                {/* {JSON.stringify(data)} */}
            </ModalBody>
            {/* <ModalFooter>
                <Button color="primary" onClick={toggle}>
                    Do Something
                </Button>{' '}
                <Button color="secondary" onClick={toggle}>
                    Cancel
                </Button>
            </ModalFooter> */}
        </Modal>
    )
}

export default Dicionario;