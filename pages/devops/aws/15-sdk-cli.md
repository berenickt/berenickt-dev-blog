---
title: '15-SDK-CLI'
date: 2024/01/10
---

## 1. SDK

- `SDK(Software Development Kit, 소프트웨어 개발 키트)`
  - 정의 : 애플리케이션을 만들기 위한 소프트웨어 개발 도구의 집합
- AWS에서는 다양한 언어와 프레임워크를 위한 SDK를 제공한다.
  - e.g. JS, Python, PHP, .Net, Ruby, Java, Go, Node.js, C++
- 또한 웹과 모바일 앱을 위한 SDK도 별도로 제공한다.
  - e.g. Web : JS, React, Angular, Vue, Next.js
  - e.g. Mobile : Android, IOS, React Native, Ionic, Flutter
- cf. AWS 공식문서 SDK : https://aws.amazon.com/ko/developer/tools/

---

## 2. CLI

- `CLI (Command Line Interface, 명령행 도구)` : 터미널을 통해서 명령을 실행할 수 있게 해주는 도구
- AWS에는 여러 종류의 CLI가 있다.
  - AWS CLI, PowerShell Tools, EC2 AMI Tools, Elastic Beanstalk CLI
  - ECS CLI, Amplify CLI, Serverless Application Model(SAM) CLI, Compilot
- cf. [AWS 명령줄 도구](https://aws.amazon.com/ko/developer/tools/)

---

## 3. (실습) Node.js와 npm 설치

Node.js LTS 버전을 다운로드한다.

- https://nodejs.org/en
- npm도 같이 설치된다.

---

## 4. (실습) Shared Credential 설정

- `Shared Credentials(공유 자격 증명)`
  - 사용하는 컴퓨터에 AWS 자격 증명을 설정함으로써
  - 해당 컴퓨터를 사용하는 사람은 별도의 설정 없이
  - SDK나 CLI를 사용하여 AWS 서비스를 사용할 수 있도록 해준다.
- 공유 자격 증명은 AWS를 사용해서 서비스를 개발하는 경우에 거의 필수적
- cf. 공유 자격 증명 생성 : [공유 config 및 credentials 파일](https://docs.aws.amazon.com/ko_kr/sdkref/latest/guide/file-format.html)

먼저 공유 자격 증명을 위한 IAM 사용자를 생성해야 한다.

- [IAM] → 왼쪽 메뉴 [사용자] → [사용자 생성] 버튼을 클릭
  - `사용자 이름` : admin
  - [다음] 버튼을 클릭
- [직접 정책 연결] 옵션을 선택.
  - 아래에 권한 정책 목록이 나오는데, 여기 검색창에 s3full 이라고 검색.
  - AmazonS3FullAccess 정책을 클릭.
  - 체크한 이후에 [다음] 버튼을 클릭.
- 마지막 단계에서는 앞에서 설정한 정보를 한 번 더 확인한다.
  - 이상이 없다면 [사용자 생성] 버튼을 클릭하여 사용자를 생성한다.

IAM 사용자가 정상 생성되면, 위에 [사용자 보기]를 클릭해 사용자 상세정보를 나온다.

- 새로운 액세스 키를 생성하기 위해서 [보안 자격 증명] 탭을 클릭한다.
- [액세스 키 만들기] 버튼을 클릭한다.
- (액세스 키 생성) 페이지가 나온다.
  - `사용 사례` : Command Line Interface(CLI)를 선택
  - 위의 권장 사항을 이해하는 확인 체크박스를 체크 표시
  - [다음] 버튼을 클릭
  - 태그를 설정하는 단계인데 건너뛴다.
  - [액세스 키 만들기] 버튼을 클릭.
  - 액세스 키는 처음 만드는 시점에만 키를 다운로드 받을 수 있다.
  - [.csv 파일 다운로드] 버튼을 클릭
- IAM 사용자의 액세스 키 목록을 보면, 액세스 키가 생성된 것을 확인할 수 있다.

이제 새로 생성한 액세스 키를 이용해서 공유 자격 증명을 설정해야 한다.

공유 자격 증명은 각 운영체제별로 사전에 정해진 위치의 파일 형태로 만들어줘야 한다.

- Linux 및 Mac :
  - `~/.aws/config`
  - `~/.aws/credentials`
- Windows
  - `%USERPROFILE%\.aws\config`
  - `%USERPROFILE%\.aws\credentials`

cf. Config와 Credentials 파일 둘 다 생성할 필요는 없고 하나만 생성하면 된다.

```bash
$ mkdir ~/.aws
$ cd ~/.aws
$ vim credentials # vim config
```

이후 credentials 파일에는 다음과 같은 형태로 공유 자격 증명을 작성하면 된다.

```
[default]
region = ap-northeast-2
aws_access_key_id = 내aws액세스키
aws_secret_access_key = 내가생성한시크릿키
```

아까 IAM 사용자의 accesskey를 생성하면서 다운로드 받은 CSV 파일을 열어서,

- accesskey ID와 secret accesskey를 복사해서 붙여 넣어준다.
- 파일을 모두 작성했다면, 명령 모드에서 `:wq`를 입력해서 저장하고 나간다.

---

## 5. (실습) AWS SDK for JS

바탕화면에 aws라는 폴더를 만든다. 그 파일을 vscode 터미널로 연다.

```bash
npm init -y

# s3를 사용하기 위한 AWS SDK 패키지 설치
npm install --save @aws-sdk/client-s3
```

`package.json` 파일에 `type:module`을 추가한다.

```json package.json
{
  "name": "aws",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@aws-sdk/client-s3": "^3.490.0"
  },
  "type": "module"
}
```

- type을 module로 해주면 Node.js에서 ECMA 스크립트 문법을 사용 가능

`index.js` 파일을 하나 만든다.

```js index.js
import {
  CreateBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

export async function main() {
  const s3Client = new S3Client({})

  // S3 버킷 생성
  const bucketName = '자신의 버킷 이름을 입력'
  await s3Client.send(
    new CreateBucketCommand({
      Bucket: bucketName,
    }),
  )

  // S3 버킷에 파일 업로드
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: 'hello.txt',
      Body: 'Hello, JavaScript SDK!',
    }),
  )
}
```

AWS SDK를 사용해서 S3 버킷을 생성하고 버킷에 파일을 업로드하는 코드이다.

```bash
node index.js
```

위 명령어가 정상적으로 실행되면, AWS 콘솔 S3 페이지에 새로 버킷이 생성된다.

- 그러면 내부에 `hello.txt`라는 객체가 존재한다.
  - cf. 작성한 코드로 업로드된 객체다.
- 객체를 클릭해서 다운로드 받아보면, 코드에서 작성한 내용이 잘 나온다.
- cf. 만약 에러 메시지가 나온다면,
  - 공유 자격 증명이 제대로 설정되어있지 않거나, 코드 상에 오류가 있는 것

---

## 6. (실습) AWS CLI 설치 및 사용

- cf. [최신 버전의 AWS CLI 설치 또는 업데이트 가이드](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/getting-started-install.html)
- 위 링크를 가보면, 각 운영체제별로 AWS CLI를 설치하는 방법이 나와있다.

AWS CLI 설치가 완료된 이후 터미널을 연다.

```bash
# 잘 설치되었는지 버전 확인
$ aws --version

# S3 버킷 목록 출력
$ aws s3 ls

# S3 새 버킷 생성 (버킷이름은 고유한 이름으로 입력)
# mb (make bucket의 약자)
$ aws s3 mb s3://<버킷이름>
```

간단한 `hello.txt` 파일을 만든다. 내용은 아무렇게 입력하면 된다.

```bash
# S3 버킷에 파일 업로드
# cp (copy의 약자)
$ aws s3 cp hello.txt s3://<버킷이름>

# S3 버킷 삭제 (버킷은 비어있어야만 삭제 가능)
# rb (remove bucket의 약자)
# force 옵션 : 강제로 진행
$ aws s3 rb --force hello.txt s3://<버킷이름>
```

---

### 6.1 AWS CLI Command Ref

- https://awscli.amazonaws.com/v2/documentation/api/latest/reference/index.html
- AWS CLI에는 각 서비스별로 수많은 명령어가 있기 때문에 모두 외우는게 불가능.
- 그래서 필요할 때마다 문서를 보고 명령어를 찾아서 사용하자.
