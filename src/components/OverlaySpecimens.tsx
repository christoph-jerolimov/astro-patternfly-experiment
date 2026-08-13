import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Content,
  Flex,
  FlexItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Popover,
  Tooltip,
} from '@patternfly/react-core';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';

/**
 * The things that appear on top of the page.
 *
 * Overlays are the components most likely to be broken by server rendering,
 * since they only exist once something is clicked — which makes them worth
 * having in a demo that hydrates rather than only screenshotting.
 */
export default function OverlaySpecimens() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card isFullHeight>
      <CardTitle>Overlays</CardTitle>
      <CardBody>
        <Content component="p">
          These exist only after a click, so they are the parts of a component library most likely
          to break under server rendering.
        </Content>

        <Flex gap={{ default: 'gapMd' }} style={{ marginBlockStart: '1rem' }}>
          <FlexItem>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open modal
            </Button>
          </FlexItem>

          <FlexItem>
            <Tooltip content="A tooltip explains a control in a few words.">
              <Button variant="secondary">Hover for a tooltip</Button>
            </Tooltip>
          </FlexItem>

          <FlexItem>
            <Popover
              headerContent="A popover"
              bodyContent="A popover holds more than a tooltip: a paragraph, a link, or a small form."
              footerContent={<Content component="small">It closes on Escape.</Content>}
            >
              <Button variant="plain" aria-label="More information">
                <OutlinedQuestionCircleIcon />
              </Button>
            </Popover>
          </FlexItem>
        </Flex>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          variant="small"
          aria-labelledby="demo-modal-title"
        >
          <ModalHeader
            title="Delete this server?"
            labelId="demo-modal-title"
            titleIconVariant="warning"
          />
          <ModalBody>
            Deleting <strong>worker-7c9f</strong> stops it and releases its volumes. This cannot be
            undone — though nothing is actually deleted here.
          </ModalBody>
          <ModalFooter>
            <Button variant="danger" onClick={() => setIsModalOpen(false)}>
              Delete
            </Button>
            <Button variant="link" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
}
