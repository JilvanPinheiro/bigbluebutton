import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import Button from '/imports/ui/components/button/component';
import Modal from '/imports/ui/components/modal/simple/component';
import { styles } from './styles';

const propTypes = {
  closeModal: PropTypes.func.isRequired,
  amIModerator: PropTypes.bool,
  isMeteorConnected: PropTypes.bool.isRequired,
};

const defaultProps = {
  amIModerator: false,
};

function randomNoRepeats(array) {
  let copy = array.slice(0);
  return function () {
    if (copy.length < 1) { copy = array.slice(0); }
    const index = Math.floor(Math.random() * copy.length);
    const item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}

class QuestionsComponent extends PureComponent {
  render() {
    const {
      amIModerator,
      closeModal,
      isMeteorConnected,
    } = this.props;

    const chooser = randomNoRepeats(
      ['CPF', 'DATA DE NASCIMENTO DO TITULAR', 'NOME COMPLETO DO TITULAR', 
        'EMAIL DO TITULAR', 'BAIRRO ONDE O TITULAR RESIDE', 'ESTADO ONDE O TITULAR RESIDE', 
        'CEP ONDE O TITULAR RESIDE', 'ENDEREÇO ONDE O TITULAR RESIDE', 'CIDADE ONDE O TITULAR RESIDE'
      ]
    );

    if (!amIModerator) return null;
    return (
      <Modal
        overlayClassName={styles.overlay}
        className={styles.modal}
        onRequestClose={closeModal}
        hideBorder
        contentLabel="Perguntas Aleatórias"
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.title}>
              Perguntas Aleatórias
            </div>
          </div>
          <div className={styles.description}>
            Geramos essas perguntas de forma aleatória. Por favor pergunte-as ao titular do certificado.
            <br />
            <br />
            <strong>{chooser()}</strong>
            <br />
            <strong>{chooser()}</strong>
            <br />
            <strong>{chooser()}</strong>
          </div>
          <div className={styles.footer}>
            <Button
              color="primary"
              className={styles.button}
              disabled={!isMeteorConnected}
              label="Fechar"
              className={styles.button}
              onClick={closeModal}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

QuestionsComponent.propTypes = propTypes;
QuestionsComponent.defaultProps = defaultProps;

export default injectIntl(QuestionsComponent);
