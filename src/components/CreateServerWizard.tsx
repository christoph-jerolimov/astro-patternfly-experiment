import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  Form,
  FormGroup,
  FormHelperText,
  FormSelect,
  FormSelectOption,
  HelperText,
  HelperTextItem,
  Label,
  LabelGroup,
  NumberInput,
  Radio,
  Switch,
  TextInput,
  Wizard,
  WizardHeader,
  WizardStep,
} from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';

import { withBase } from '../site';

const regions = [
  { value: 'eu-central-1', label: 'Frankfurt (eu-central-1)' },
  { value: 'us-east-1', label: 'Virginia (us-east-1)' },
  { value: 'ap-south-1', label: 'Mumbai (ap-south-1)' },
  { value: 'eu-west-2', label: 'London (eu-west-2)' },
];

const sizes = [
  { id: 'small', label: 'Small', detail: '2 vCPU, 4 GB — for workers and cron jobs.' },
  { id: 'medium', label: 'Medium', detail: '4 vCPU, 16 GB — the default for services.' },
  { id: 'large', label: 'Large', detail: '8 vCPU, 32 GB — for databases and caches.' },
];

/**
 * A multi-step create flow.
 *
 * Each step validates on its own, and Next is disabled until the step is
 * valid rather than letting the reader reach Review and be told there that
 * something three steps back is wrong. Steps that are not valid yet also carry
 * an error status, so the nav on the left says which one needs attention.
 */
export default function CreateServerWizard() {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('eu-central-1');
  const [size, setSize] = useState('medium');
  const [replicas, setReplicas] = useState(2);
  const [isPublic, setIsPublic] = useState(false);
  const [autoRestart, setAutoRestart] = useState(true);
  const [acceptsCost, setAcceptsCost] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  // A step is only marked as failing once it has been reached. Flagging a step
  // red before the reader has seen it scolds them for a field they have not
  // had the chance to fill in.
  const [visited, setVisited] = useState<string[]>(['step-basics']);

  // Same rule the settings form uses, so an invalid name is reachable by
  // typing rather than only describable in prose.
  const isNameValid = /^[a-z0-9-]+$/.test(name);
  const isBasicsValid = isNameValid;
  const isSizeValid = replicas >= 1 && replicas <= 9;
  const isReviewValid = acceptsCost;

  // Untouched is not the same as wrong: an empty name blocks Next without
  // turning the step red, while a name that was typed and is invalid does.
  const statusFor = (id: string, isValid: boolean, isTouched = true) =>
    visited.includes(id) && isTouched && !isValid ? ('error' as const) : ('default' as const);

  if (isCreated) {
    return (
      <EmptyState
        headingLevel="h2"
        icon={CheckCircleIcon}
        status="success"
        titleText={`${name} is being created`}
        variant="lg"
      >
        <EmptyStateBody>
          Nothing was actually provisioned — this is where a real wizard would hand off to the
          server it just made.
        </EmptyStateBody>
        <EmptyStateFooter>
          <EmptyStateActions>
            <Button variant="primary" component="a" href={withBase('/servers/')}>
              Back to servers
            </Button>
          </EmptyStateActions>
          <EmptyStateActions>
            <Button
              variant="link"
              onClick={() => {
                setIsCreated(false);
                setName('');
                setAcceptsCost(false);
              }}
            >
              Create another
            </Button>
          </EmptyStateActions>
        </EmptyStateFooter>
      </EmptyState>
    );
  }

  return (
    <Wizard
      height={520}
      navAriaLabel="Create server steps"
      header={
        <WizardHeader
          title="Create server"
          description="Four steps, each validating on its own before the next unlocks."
          isCloseHidden
        />
      }
      onStepChange={(_event, currentStep) =>
        setVisited((current) =>
          current.includes(String(currentStep.id)) ? current : [...current, String(currentStep.id)],
        )
      }
      onSave={() => setIsCreated(true)}
    >
      <WizardStep
        name="Basics"
        id="step-basics"
        status={statusFor('step-basics', isBasicsValid, name !== '')}
        footer={{ isNextDisabled: !isBasicsValid }}
      >
        <Form>
          <FormGroup label="Server name" isRequired fieldId="wizard-name">
            <TextInput
              id="wizard-name"
              value={name}
              onChange={(_event, value) => setName(value)}
              validated={name === '' ? 'default' : isNameValid ? 'success' : 'error'}
              aria-describedby="wizard-name-help"
            />
            <FormHelperText>
              <HelperText id="wizard-name-help">
                <HelperTextItem
                  variant={name === '' ? 'default' : isNameValid ? 'success' : 'error'}
                >
                  Lowercase letters, numbers and dashes. Next stays disabled until this is valid.
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>

          <FormGroup label="Region" fieldId="wizard-region">
            <FormSelect
              id="wizard-region"
              value={region}
              onChange={(_event, value) => setRegion(value)}
            >
              {regions.map((option) => (
                <FormSelectOption key={option.value} value={option.value} label={option.label} />
              ))}
            </FormSelect>
          </FormGroup>
        </Form>
      </WizardStep>

      <WizardStep
        name="Size"
        id="step-size"
        status={statusFor('step-size', isSizeValid)}
        footer={{ isNextDisabled: !isSizeValid }}
      >
        <Form>
          <FormGroup role="radiogroup" isStack label="Instance size" fieldId="wizard-size">
            {sizes.map((option) => (
              <Radio
                key={option.id}
                id={`wizard-size-${option.id}`}
                name="wizard-size"
                label={option.label}
                description={option.detail}
                isChecked={size === option.id}
                onChange={() => setSize(option.id)}
              />
            ))}
          </FormGroup>

          <FormGroup label="Replicas" fieldId="wizard-replicas">
            <NumberInput
              value={replicas}
              min={1}
              max={9}
              onMinus={() => setReplicas((value) => Math.max(1, value - 1))}
              onPlus={() => setReplicas((value) => Math.min(9, value + 1))}
              onChange={(event) => {
                const next = Number((event.target as HTMLInputElement).value);
                setReplicas(Number.isNaN(next) ? 1 : next);
              }}
              inputAriaLabel="Number of replicas"
              minusBtnAriaLabel="Fewer replicas"
              plusBtnAriaLabel="More replicas"
            />
          </FormGroup>
        </Form>
      </WizardStep>

      <WizardStep name="Networking" id="step-networking">
        <Form>
          <FormGroup label="Access" isStack fieldId="wizard-access">
            <Switch
              id="wizard-public"
              label="Reachable from the public internet"
              isChecked={isPublic}
              onChange={(_event, checked) => setIsPublic(checked)}
            />
            <Switch
              id="wizard-auto-restart"
              label="Restart automatically when unhealthy"
              isChecked={autoRestart}
              onChange={(_event, checked) => setAutoRestart(checked)}
            />
          </FormGroup>

          {isPublic && (
            <Alert
              variant="warning"
              isInline
              isPlain
              title="A public server needs a firewall rule before it accepts traffic."
            />
          )}
        </Form>
      </WizardStep>

      <WizardStep
        name="Review"
        id="step-review"
        status={statusFor('step-review', isReviewValid)}
        footer={{ nextButtonText: 'Create server', isNextDisabled: !isReviewValid }}
      >
        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Name</DescriptionListTerm>
            <DescriptionListDescription>{name}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Region</DescriptionListTerm>
            <DescriptionListDescription>
              {regions.find((option) => option.value === region)?.label}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Size</DescriptionListTerm>
            <DescriptionListDescription>
              {sizes.find((option) => option.id === size)?.label} × {replicas}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Networking</DescriptionListTerm>
            <DescriptionListDescription>
              <LabelGroup>
                <Label isCompact color={isPublic ? 'orange' : 'blue'}>
                  {isPublic ? 'Public' : 'Private'}
                </Label>
                <Label isCompact color={autoRestart ? 'green' : 'grey'}>
                  {autoRestart ? 'Auto-restart on' : 'Auto-restart off'}
                </Label>
              </LabelGroup>
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>

        <Form style={{ marginBlockStart: '1.5rem' }}>
          <FormGroup fieldId="wizard-cost">
            <Checkbox
              id="wizard-cost"
              label="I understand this would start costing money"
              description="Nothing is provisioned here, but a real wizard should make the last step a decision rather than a formality."
              isChecked={acceptsCost}
              onChange={(_event, checked) => setAcceptsCost(checked)}
            />
          </FormGroup>
        </Form>
      </WizardStep>
    </Wizard>
  );
}
