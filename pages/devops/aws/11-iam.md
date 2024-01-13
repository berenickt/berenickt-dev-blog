---
title: '11-IAM'
date: 2024/01/10
---

## 1. IAM

* `IAM(Identity and Access Management)` : AWS 리소스에 대한 권한을 관리하는 서비스
* IAM 사용자 및 그룹을 만들어서 관리
* 권한을 사용해 AWS 리소스에 대한 액세스를 허용 및 거부할 수 있음
* 추가 비용 없이 제공 되며, 사용자가 사용한 다른 AWS 서비스에 대해서만 요금이 부과됨
* Key를 발급함으로써 AWS 외부에서 API로 접근할 수 있음

------

### 1.1 IAM 기본 개념

IAM은 Root계정 노출없이 사용자에게 제한적인 권한(Role)을 부여하고 싶을때 사용한다.

* `User` : **AWS 서비스 사용자**를 의미하는데, 사람 또는 외부 애플리케이션이 User가 된다.
* `Group` : **User들의 집합**을 의미
* `Role(역할)` : **AWS의 작업과 리소스에 대한 액세스를 부여하는 권한 세트**를 의미
* `Policy` :  **특정 AWS 요소의 특정 기능을 사용하기 위한 정책**을 의미
* `Permission` : **Policy들의 집합**을 의미

사용하는 방식에는 크게 Programmatic Access와 Management Console Access 2가지가 있다.

* `Programmatic Access` : AWS SDK등을 이용하여 AWS 서비스에 API로 접근하는 방식
  * Access key ID, Secret access key로 구성된 키가 발급 되며 일반적으로 많이 사용하는 방법
* `Management Console Access` : 브라우저를 통해 전용 Console login link로 접속하는 방식
  * AWS Management Console에 제한된 로그인이 필요할 때 사용한다

------

### 1.2 IAM 사용 형태

* AWS의 리소스와 서비스에 접근하려고 하는 사용자 및 그룹이 있으며, 각 사용자 및 그룹은 필요한 Policy들을 갖고 있다.
* AWS Lambda 같은 다른 서비스가 AWS의 서비스에 접근할 수 있도록 하기 위해서 Role을 부여한 것도 볼 수 있다.

------

## 2. (실습) IAM 사용자 추가





------

## 3. (실습) IAM 사용자로 로그인





------

## 4. (실습) IAM 그룹 생성 및 사용자 추가







------

## 5. (실습) IAM 사용자 및 그룹 삭제





