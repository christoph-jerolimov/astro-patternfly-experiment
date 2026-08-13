import { useState } from 'react';
import {
  ActionGroup,
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  FormHelperText,
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  Radio,
  Stack,
  StackItem,
  Switch,
  TextInput,
} from '@patternfly/react-core';

const regions = [
  { value: 'eu-central-1', label: 'Frankfurt (eu-central-1)' },
  { value: 'us-east-1', label: 'Virginia (us-east-1)' },
  { value: 'ap-south-1', label: 'Mumbai (ap-south-1)' },
  { value: 'eu-west-2', label: 'London (eu-west-2)' },
];

/**
 * A preferences form.
 *
 * The project name is validated as you type rather than only on save, so the
 * error state is reachable without submitting something invalid.
 */
export default function SettingsForm() {
  const [projectName, setProjectName] = useState('astro-patternfly-experiment');
  const [region, setRegion] = useState('eu-central-1');
  const [notify, setNotify] = useState<'all' | 'failures' | 'none'>('failures');
  const [autoRestart, setAutoRestart] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [saved, setSaved] = useState(false);

  // Same rule a real project name would use, so the invalid state is easy to
  // reach: type a space or a capital letter.
  const isNameValid = /^[a-z0-9-]+$/.test(projectName);

  return (
    <Stack hasGutter>
      {saved && (
        <StackItem>
          <Alert
            variant="success"
            isInline
            title="Preferences saved"
            actionClose={
              <Button variant="plain" aria-label="Close" onClick={() => setSaved(false)} />
            }
          >
            Nothing was persisted — this demo only shows the state a real save would leave behind.
          </Alert>
        </StackItem>
      )}

      <StackItem>
        <Grid hasGutter>
          <GridItem lg={6}>
            <Card isFullHeight>
              <CardTitle>Project</CardTitle>
              <CardBody>
                <Form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSaved(true);
                  }}
                >
                  <FormGroup label="Project name" isRequired fieldId="project-name">
                    <TextInput
                      id="project-name"
                      value={projectName}
                      onChange={(_event, value) => {
                        setProjectName(value);
                        setSaved(false);
                      }}
                      validated={isNameValid ? 'default' : 'error'}
                      aria-describedby="project-name-help"
                    />
                    <FormHelperText>
                      <HelperText id="project-name-help">
                        <HelperTextItem variant={isNameValid ? 'default' : 'error'}>
                          {isNameValid
                            ? 'Lowercase letters, numbers and dashes.'
                            : 'Only lowercase letters, numbers and dashes are allowed.'}
                        </HelperTextItem>
                      </HelperText>
                    </FormHelperText>
                  </FormGroup>

                  <FormGroup label="Default region" fieldId="region">
                    <FormSelect
                      id="region"
                      value={region}
                      onChange={(_event, value) => {
                        setRegion(value);
                        setSaved(false);
                      }}
                    >
                      {regions.map((option) => (
                        <FormSelectOption
                          key={option.value}
                          value={option.value}
                          label={option.label}
                        />
                      ))}
                    </FormSelect>
                  </FormGroup>

                  <ActionGroup>
                    <Button variant="primary" type="submit" isDisabled={!isNameValid}>
                      Save
                    </Button>
                    <Button variant="link">Cancel</Button>
                  </ActionGroup>
                </Form>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem lg={6}>
            <Card isFullHeight>
              <CardTitle>Notifications and automation</CardTitle>
              <CardBody>
                <Form>
                  <FormGroup role="radiogroup" isStack label="Email me about" fieldId="notify">
                    <Radio
                      id="notify-all"
                      name="notify"
                      label="Every deployment"
                      isChecked={notify === 'all'}
                      onChange={() => setNotify('all')}
                    />
                    <Radio
                      id="notify-failures"
                      name="notify"
                      label="Only failures"
                      description="The default. Successful deploys stay quiet."
                      isChecked={notify === 'failures'}
                      onChange={() => setNotify('failures')}
                    />
                    <Radio
                      id="notify-none"
                      name="notify"
                      label="Nothing"
                      isChecked={notify === 'none'}
                      onChange={() => setNotify('none')}
                    />
                  </FormGroup>

                  <FormGroup label="Automation" isStack fieldId="automation">
                    <Switch
                      id="auto-restart"
                      label="Restart unhealthy servers automatically"
                      isChecked={autoRestart}
                      onChange={(_event, checked) => setAutoRestart(checked)}
                    />
                    <Switch
                      id="maintenance"
                      label="Maintenance mode"
                      isChecked={maintenance}
                      onChange={(_event, checked) => setMaintenance(checked)}
                    />
                  </FormGroup>

                  {maintenance && (
                    <Alert
                      variant="warning"
                      isInline
                      isPlain
                      title="Maintenance mode routes all traffic to the status page."
                    />
                  )}
                </Form>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </StackItem>
    </Stack>
  );
}
