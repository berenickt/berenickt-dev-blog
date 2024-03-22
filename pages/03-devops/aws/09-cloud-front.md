---
title: '09-Cloud Front'
date: 2024/01/10
---

## 1. CloudFront

- `CloudFront`는 `CDN(Content Delivery Network, 컨텐츠 전송 네트워크)` 서비스이다.
- CDN이 하는 역할은 이름 그대로 **콘텐츠를 전세계로 빠르게 전송할 수 있게 해주는 것**
- AWS에서 이 CDN의 역할을 하는 서비스가 바로 `CloudFront`

---

### 1.1 CloudFront 특징

- 콘텐츠 전송 네트워크(CDN)
- 콘텐츠(이미지, HTML)를 캐싱하여 성능 가속
- 전 세계 수많은 Edge Location을 통해 콘텐츠를 빠르게 전세계로 전송 가능
- 글로벌 고속 백본 네트워크 확보있음
- AWS 서비스 <---> CloudFront 데이터 전송 무료
- DDoS 방어 무료 제공(AWS Shield Standard)

---

### 1.2 AWS Shield Standard

- AWS에서 실행되는 애플리케이션을 보호하는 DDoS 보호 서비스
- CloudFront에서는 AWS Shield Standard에 의한 L3/L4 DDoS 보호는 추가 비용 없이 포함된다.
- AWS는 전 세계에 400개 이상의 **엣지 로케이션**이 존재한다고 나와 있는데,
  - 이 엣지 로케이션이 바로 CloudFront같은 CDN 서비스를 제공하기 위한 목적으로 사용된다.

---

### 1.3 CloudFront 기본 용어

- `배포(Distribution)`
  - **CloudFront의 가장 기본적인 단위**를 의미
  - 각 배포는 고유의 도메인을 가지게 되며,
  - Route 53이라는 AWS의 DNS 서비스를 사용해서 자신이 구입한 도메인에 연결할 수 있다.
- `오리진(Origin)`
  - **원본 파일을 가져오는 위치**를 의미
  - 기본 설정은 S3로 되어 있으며, EC2, ELB, 외부서버 등으로 커스텀 설정도 가능하다

---

## 2. (실습) S3 버킷 생성

```
(클라이언트 요청) ⎯⎯⎯> (CloudFront)  ⎯⎯⎯> (S3)
```

CloudFront를 사용하기 전에 먼저 S3 버킷을 생성해야 한다.

- [S3] → [버킷]페이지 오른쪽에 있는 [bucket 만들기] 버튼을 클릭.
- 그러면 버킷을 생성하는 화면이 나온다.
- `버킷 이름` : sw-bucket-240114-2
  - cf. 주의할 점은 버킷 이름은 DNS 형식으로 전 세계에서 유일해야 한다
- `객체 소유권` : ACL 비활성화됨을 그대로 사용
- `이 버킷의 퍼블릭 액세스 차단 설정`
  - 퍼블릭 액세스가 차단되어 있으면 외부에서 버킷에 있는 객체에 접근할 수 없다.
  - 이 옵션을 선택한 상태로 버킷을 생성한다.
- 화면을 제일 하단으로 내려서 [버킷 만들기] 버튼을 클릭

여기서 해당 버킷을 눌러서 들어가 보면, 각종 탭과 객체 목록이 나온다.

- 현재는 아무런 객체도 들어 있지 않기 때문에 비어 있다.

---

## 3. (실습) S3 버킷에 파일 업로드

간단한 내용의 hello.txt 파일을 작성한다.

- 이후 [S3] → [버킷] 페이지에서 [업로드] 버튼을 클릭.
- 그러면 파일 업로드 화면이 나오는데, [파일 추가] 버튼을 클릭.
- 작성한 파일을 선택해서 [열기] 버튼을 클릭.
- 화면 하단에 있는 [업로드] 버튼을 클릭해서 파일을 업로드한다.

---

## 4. (실습) CloudFront 배포 생성

[CloudFront] 페이지에서 [Cloud 배포 생성] 버튼을 클릭한다.

(배포 생성) 페이지

- `원본 도메인` : 앞에서 미리 만들어둔 S3 버킷을 선택.
- `원본 액세스` : 원본 액세스 제어 설정(권장)에 체크
  - cf. 원본에 접근할 수 있는 권한을 설정하는 것
  - 그럼 아래 옵션이 바뀌고, [제어 설정 생성] 버튼을 클릭.
  - 제어 설정을 생성할 수 있는 다이얼로그가 나온다.
  - 이름을 MyOriginAccess라고 변경하고, 하단에 [생성] 버튼 클릭
  - Origin access control에 방금 만든 제어 설정을 클릭한다.
- `기본 캐시 동작` : 기본값을 그대로 사용
- `함수 연결 옵션` : 사용하지 않는다.
- `웹 애플리케이션 방화벽(WAF)` : 보안 보호 비활성화 체크
  - cf. 이 보안보호 활성화를 하면, 여러가지 취약점으로부터 앱을 보호할 수 있는데
  - 유료 기능이기 때문에, 비활성화를 시킨다.
- `설정` : 다른 설정은 그대로 사용, 기본값 루트 객체를 설정한다.
  - `기본값 루트 객체` : 버킷의 최상위 경로에 업로드한 hello.txt 파일 이름을 입력
  - cf. 이는 클라우드 프론트 배포의 URL로 접속할 경우, 나오게 될 객체를 의미
- 이제 [배포 생성] 버튼을 클릭한다.

CloudFront 배포 생성은 시간이 조금 걸린다. 이제 이 상태에서 클라우드 프론트가 S3 버킷으로부터 객체들에 접근할 수 있도록 S3 버킷의 정책을 업데이트해야 한다.

- [정책 복사] 버튼을 클릭하여 정책을 복사하고, S3 버킷 권한으로 이동하는 링크를 클릭
- 링크를 클릭하면 S3 버킷 [권한] 탭이 나온다.
- 화면을 아래로 내리면 버킷 정책을 설정할 수 있는 옵션이 나오는데,
  - 여기서 [편집] 버튼을 클릭하고, 복사해둔 정책을 붙여넣으면 된다.
  - cf. 만약 나중에 정책을 직접 만들고 싶으면, AWS의 공식 문서 중 [Amazon S3 오리진에 대한 액세스 제한 문서](https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)를 참고
- 화면 하단에 있는 [변경 사항 저장] 버튼을 클릭

아까 업로드한 hello.txt 파일의 상세 정보에서 객체 URL을 복사해서 접속해보면,

- 접속하면, AccessDenied 에러 메시지가 나온다.
- 이렇게 되는 이유는 현재 정책에서는 hello.txt 객체의 S3 URL로 접근할 수 있는 권한이 없기 때문이다.

이번에는 CloudFront를 통해서 접속해본다.

- [CloudFront] → [배포] 상세 페이지에서 배포 도메인 이름을 복사.
- 배포 도메인을 복사한 이후에 브라우저에서 접속하면,
  - 루트 객체로 지정한 hello.txt가 정상적으로 나온다.
- 그 상태에서 브라우저 개발자도구의 Newtwork 탭에서 문서를 클릭한채로 새로고침.
- 클릭해서 상세 정보를 보면
  - `X-Cache : Miss from cloudfront`라고 되어 있는 응답을 볼 수있다.
- cf. 캐시에는 miss와 hit라는 용어가 있는데,
  - 캐시에서 가져올 경우 hit,
  - 캐시에 없을 경우 miss라고 표현한다.
- 그래서 지금은 CloudFront에 캐싱이 되지 않았기 때문에 miss라고 나오는 것.
- 이 상태에서 세로고침을 계속하다 보면,
  - `X-Cache : Hit from cloudfront`라고 바뀐다.
- 이는 CloudFront를 사용하여 엣지 로케이션을 통해 캐싱된 데이터를 가져온 것이다.

---

## 5. (실습) CloudFront 배포 삭제

배포를 삭제하기 위해서는 먼저 비활성화를 해야 한다.

- [CloudFront] → [배포]를 선택합니다.
- 삭제할 CloudFront 선택한 이후에 비활성화 버튼을 클릭.
- 그럼 확인 다이얼로그가 뜨고, [비활성화] 버튼을 클릭.
  - cf. 비활성화가 시작되는데 이 작업도 약간 시간이 소요됨.
- 어느 정도 시간이 지나면, [비활성화]가 완료되고,
- 이 상태에서 다시 삭제할 CloudFront 선택한 이후 [삭제] 버튼을 클릭.
  - 다시 한번 그럼 배포를 정말 삭제할 것인지 묻는 다이얼로그가 나오고,
  - [삭제] 버튼을 클릭하여 삭제한다.
- 이렇게 클라우드 프론트 배포가 정상적으로 삭제되었습니다.