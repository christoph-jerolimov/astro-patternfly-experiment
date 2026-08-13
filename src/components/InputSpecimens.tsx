import { useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Checkbox,
  Form,
  FormGroup,
  FormHelperText,
  FormSelect,
  FormSelectOption,
  HelperText,
  HelperTextItem,
  NumberInput,
  Radio,
  SearchInput,
  Slider,
  Switch,
  TextArea,
  TextInput,
} from '@patternfly/react-core';

/**
 * The input controls, including the states that are easy to forget: disabled,
 * invalid and read-only. A page that only shows the resting state hides the
 * half of the design that matters when something goes wrong.
 */
export default function InputSpecimens() {
  const [text, setText] = useState('Editable');
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(3);
  const [slider, setSlider] = useState(40);
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState('one');
  const [switched, setSwitched] = useState(true);

  return (
    <Card isFullHeight>
      <CardTitle>Inputs</CardTitle>
      <CardBody>
        <Form>
          <FormGroup label="Text input" fieldId="specimen-text">
            <TextInput
              id="specimen-text"
              value={text}
              onChange={(_event, value) => setText(value)}
            />
          </FormGroup>

          <FormGroup label="Invalid" fieldId="specimen-invalid">
            <TextInput
              id="specimen-invalid"
              value="Not a valid value"
              validated="error"
              readOnlyVariant="default"
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem variant="error">This is what an error looks like.</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>

          <FormGroup label="Disabled" fieldId="specimen-disabled">
            <TextInput id="specimen-disabled" value="Cannot be edited" isDisabled />
          </FormGroup>

          <FormGroup label="Search" fieldId="specimen-search">
            <SearchInput
              aria-label="Search specimen"
              placeholder="Search"
              value={search}
              onChange={(_event, value) => setSearch(value)}
              onClear={() => setSearch('')}
            />
          </FormGroup>

          <FormGroup label="Select" fieldId="specimen-select">
            <FormSelect id="specimen-select" value="two" onChange={() => {}}>
              <FormSelectOption value="one" label="First option" />
              <FormSelectOption value="two" label="Second option" />
              <FormSelectOption value="three" label="Third option" />
            </FormSelect>
          </FormGroup>

          <FormGroup label="Text area" fieldId="specimen-textarea">
            <TextArea
              id="specimen-textarea"
              aria-label="Text area specimen"
              value={'Two lines of text,\nso the resize handle has something to do.'}
              onChange={() => {}}
            />
          </FormGroup>

          <FormGroup label="Number" fieldId="specimen-number">
            <NumberInput
              value={count}
              min={0}
              max={10}
              onMinus={() => setCount((value) => Math.max(0, value - 1))}
              onPlus={() => setCount((value) => Math.min(10, value + 1))}
              onChange={(event) => setCount(Number((event.target as HTMLInputElement).value))}
              inputAriaLabel="Number of replicas"
              minusBtnAriaLabel="Fewer replicas"
              plusBtnAriaLabel="More replicas"
            />
          </FormGroup>

          <FormGroup label="Slider" fieldId="specimen-slider">
            <Slider
              value={slider}
              onChange={(_event, value) => setSlider(value)}
              showBoundaries
              max={100}
              min={0}
            />
          </FormGroup>

          <FormGroup label="Toggles" isStack fieldId="specimen-toggles">
            <Checkbox
              id="specimen-checkbox"
              label="A checkbox"
              isChecked={checked}
              onChange={(_event, value) => setChecked(value)}
            />
            <Checkbox id="specimen-checkbox-disabled" label="A disabled checkbox" isDisabled />
            <Radio
              id="specimen-radio-one"
              name="specimen-radio"
              label="First choice"
              isChecked={radio === 'one'}
              onChange={() => setRadio('one')}
            />
            <Radio
              id="specimen-radio-two"
              name="specimen-radio"
              label="Second choice"
              isChecked={radio === 'two'}
              onChange={() => setRadio('two')}
            />
            <Switch
              id="specimen-switch"
              label="A switch"
              isChecked={switched}
              onChange={(_event, value) => setSwitched(value)}
            />
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
}
