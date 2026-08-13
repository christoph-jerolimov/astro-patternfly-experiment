import { useState } from 'react';
import { ListItem, LoginFooterItem, LoginForm, LoginPage } from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';

import { withBase } from '../site';

/**
 * A sign-in screen.
 *
 * Nothing is actually authenticated — submitting shows the error state a real
 * form would show, because an inert login screen that just does nothing is the
 * least interesting half of the component to look at.
 */
export default function LoginDemo() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showHelperText, setShowHelperText] = useState(false);

  const isUsernameValid = !showHelperText || username !== '';
  const isPasswordValid = !showHelperText || password !== '';

  const onSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowHelperText(true);
  };

  const helperText = showHelperText
    ? username === '' || password === ''
      ? 'Enter a username and a password.'
      : 'Those credentials were not recognised. This demo accepts none.'
    : undefined;

  return (
    <LoginPage
      brandImgSrc={withBase('/logo.svg')}
      brandImgAlt="Astro + PatternFly"
      loginTitle="Log in to your account"
      loginSubtitle="Use your organisation's single sign-on, or a local account."
      textContent="A PatternFly login screen rendered by Astro. It sits outside the app chrome, because a sign-in page has no navigation to offer yet. Nothing is submitted anywhere: the form shows the error state a real one would."
      forgotCredentials={
        <LoginFooterItem href={withBase('/')}>Forgot your password?</LoginFooterItem>
      }
      footerListItems={
        <>
          <ListItem>
            <LoginFooterItem href={withBase('/')}>Terms of use</LoginFooterItem>
          </ListItem>
          <ListItem>
            <LoginFooterItem href={withBase('/')}>Help</LoginFooterItem>
          </ListItem>
        </>
      }
    >
      <LoginForm
        showHelperText={showHelperText}
        helperText={helperText}
        helperTextIcon={<ExclamationCircleIcon />}
        usernameLabel="Username"
        usernameValue={username}
        onChangeUsername={(_event, value) => setUsername(value)}
        isValidUsername={isUsernameValid}
        passwordLabel="Password"
        passwordValue={password}
        onChangePassword={(_event, value) => setPassword(value)}
        isValidPassword={isPasswordValid}
        isShowPasswordEnabled
        showPasswordAriaLabel="Show password"
        hidePasswordAriaLabel="Hide password"
        rememberMeLabel="Keep me logged in for 30 days"
        isRememberMeChecked={rememberMe}
        onChangeRememberMe={(_event, checked) => setRememberMe(checked)}
        loginButtonLabel="Log in"
        onLoginButtonClick={onSubmit}
      />
    </LoginPage>
  );
}
