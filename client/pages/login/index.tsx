import Input from '../../components/atoms/input/Input';
import Button from '../../components/atoms/button/Button';
import Label from '../../components/atoms/label/Label';
import TextField from '../../components/molecules/passwordTextField/TextField';
import { useState } from 'react';
import { ReactComponent as Logo } from '../../public/logos/logoRow.svg';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { requestLogin, requestSignUp } from '../../api/members';
import Cookies from 'js-cookie';
import { getAllUsers } from '../../api/members';
import useRegexText from '../../hooks/useRegexText';
import React from 'react';
import Image from 'next/image';
import Divider from '@mui/material/Divider';
import axios from 'axios';

const LoginPage = () => {
  const emailRegex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
  const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[!@#$%^&*])(?=.{8,})');

  const router = useRouter();

  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [form, setForm] = useState({
    email: '',
    pw: '',
  });

  const { email, pw } = form;

  const emailRegexText = useRegexText({
    state: email,
    regex: emailRegex,
    text: {
      default: '',
      match: '',
      unMatch: '이메일 양식에 맞게 입력해주세요',
    },
  });
  const passwordRegexText = useRegexText({
    state: pw,
    regex: passwordRegex,
    text: {
      default: '',
      match: '',
      unMatch: '소문자, 특수문자를 각 하나 포함한 8자리 이상이여야 합니다.',
    },
  });

  const { data, error, mutate } = useMutation(requestLogin, {
    onSuccess: (data) => {
      data.headers.authorization &&
        Cookies.set('access_token', data.headers.authorization);
      data.headers.refresh &&
        Cookies.set('refresh_token', data.headers.refresh);
      Cookies.set('memberId', data.data.memberId);
      Cookies.set('nickName', data.data.nickName);
      Cookies.set('locationId', data.data.locationId);
      router.push('/');
    },
    onError: (error) => {
      setLoginErrorMessage('정확하지 않은 이메일 또는 패스워드입니다');
    },
  });

  const handleLogin = async () => {
    const data = await axios({
      method: 'post',
      data: { pw },
      url: '/api/passwordHash',
    });
    console.log(data);

    await mutate();
  };

  const handleSocialLogin = async () => {
    router.push('https://ngether.site/oauth2/authorization/google');
  };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <div>
      <div className="mt-24">
        <LoginSlogan />
      </div>
      <div className="login flex justify-center m-7 my-12">
        <div className="flex flex-col w-10/12 max-w-lg">
          <Input
            id="email-input"
            name="email"
            type={'text'}
            label="이메일"
            value={email}
            onChange={onChange}
          />
          <Label htmlFor={'email-input'} labelText={emailRegexText} />
          <TextField
            id="password-input"
            name="pw"
            label="패스워드"
            value={pw}
            onChange={onChange}
          />
          <Label htmlFor={'password-input'} labelText={passwordRegexText} />
          <p className="text-[#dd3030]">{loginErrorMessage}</p>
          <Button
            className="h-14 mt-4 bg-primary text-white rounded"
            onClick={handleLogin}
          >
            로그인
          </Button>
          <Button
            className="h-14 my-4 border-solid border-1 border-[#63A8DA] text-primary rounded "
            onClick={() => router.push('/signup')}
          >
            회원가입
          </Button>
          <Divider />
          <Button className="h-14 mt-4" onClick={() => handleSocialLogin()}>
            <div
              style={{ width: '100%', height: '100%', position: 'relative' }}
            >
              <Image
                alt="google login"
                src="/login/btn_google.png"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

const LoginSlogan = () => {
  return (
    <div className="flex flex-col items-center">
      <Logo />
      <p className="pt-px mt-4 text-lg">
        <strong className="text-primary font-bold">로그인</strong>하고
      </p>
      <p className="pb-px text-lg">
        <strong className="text-primary font-bold">쇼핑 친구</strong>를
        만나보세요
      </p>
    </div>
  );
};
