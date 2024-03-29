---
title: '12-Cloud Watch'
date: 2024/01/10
---

## 1. CloudWatch

- `CloudWatch` : 말 그대로 **클라우드를 지켜본다**는 뜻으로, **클라우드 모니터링 서비스**를 의미
- 실시간 로그, 지표 및 이벤트 데이터를 자동화된 대시보드에 수집하고,
  - 이를 시각화하여 인프라 및 애플리케이션 유지 관리를 간소화시켜줌
- AWS 리소스 및 애플리케이션 모니터링 서비스이며, 강력한 시각화 도구를 제공
- 사전에 지정된 값에 따라 알림 발송 기능을 제공하며,
  - 로그 및 지표에서 도출된 인사이트를 통해 운영의 문제를 해결할 수 있다.

---

## 2. (실습) EC2 인스턴스 생성

[EC2] → [인스턴스 시작] 버튼을 눌러 새 인스턴스를 생성한다.

- `이름` : MyFirstSever
  - [추가 태그 추가] 버튼을 클릭해 이름을 태그형태로 추가한다.
- `Application and OS Images` : Ubuntu
  - 프리티어 사용가능인 22.04 LTS Ubuntu 선택
- `인스턴스 유형` : 프리티어 사용가능인 T2.micro를 선택
- `키 페어` : 기존에 계속 사용하던 키페어 선택
- `네트워크 설정` :
  - 새로운 보안 그룹 생성을 선택하고 Secure Shell이라고 부르는 SSH를
  - 통해서 접속할 것이기 때문에 SSH 트래픽 허용을 체크.
- `스토리지 구성` : 기본 설정인 8GB GP2 루트 볼륨을 그대로 사용.

모든 설정을 마쳤으면, 오른쪽 하단에 있는 [인스턴스 시작] 버튼을 클릭

---

## 3. (실습) CloudWatch 알림 생성

[EC2] → [인스턴스]의 목록에서 인스턴스를 선택하고, [모니터링] 탭을 클릭한다.

- 그러면 다양한 지표들이 나오는데, [CPU 사용률]의 더보기 메뉴를 클릭
  - 하위 메뉴에서 [지표에서 보기] 버튼을 클릭
- 그러면 CloudWatch 페이지에서 해당 지표에 대한 상세 정보가 나온다.
- 여기서 지표 하단의 오른쪽에 있는 [알람 아이콘] 버튼을 클릭한다.
- 그러면 (경보 생성) 화면이 나온다.

---

### 1단계 지표 및 조건 지정

현재 지표는 CPU 사용률이며, 평균값이 5분 동안 정한 임계값을 넘으면 경보가 울린다.

- `맨 아래, 조건 설정 섹션에 임계값을 정의하는 부분` : 80
  - cf. 평균 CPU 사용률이 5분 이상 80%를 넘으면 경보가 발생한다
- [다음] 버튼을 클릭한다.

---

### 2단계 작업 구성

알림을 설정하거나 Auto Scaling 작업이나 EC2 작업 등을 설정할 수 있는 단계

- [새 주제 생성] 옵션을 선택한다.
- 새 주제 생성을 선택하면,
  - 아래에 알림을 수신할 이메일 엔드포인트를 입력하는 곳이 나타난다.
  - 이메일 주소를 입력한다.
  - 이후 [주제 생성] 버튼을 클릭하여 주제를 생성한다.
  - 주제를 생성하고, 이메일 엔드포인트가 선택되었는지 확인한다.
- 화면을 제일 하단으로 내려서 [다음] 버튼을 클릭한다.

---

### 3단계 이름 및 설명 추가

- `경보이름` : TestAlert
  - 아래에서는 경보에 대한 설명을 마크다운 형식으로 작성할 수 있다.
- `경보설명` : #테스트 경보다
- [다음] 버튼을 클릭한다.

---

### 4단계 미리보기 및 생성

마지막 단계는 앞에서 설정한 내용들을 전체적으로 확인하는 단계이다.

- 모든 내용을 확인한 이후에 [경보 생성] 버튼을 클릭한다.

경보가 생성되면, [경보 보기] 버튼을 클릭해 상세정보를 볼 수 있다.

- 다시 뒤로가기를 한 뒤, 이번에는 [SNS 구독 보기] 버튼을 클릭.
- 그러면 SNS 페이지가 나오고, 이메일 주소가 아직 [확인 대기 중]인 것을 볼 수 있다.
- 각자 메일함에 가보면 AWS에서 발송한 메일이 있을 것이다.
- 해당 이메일을 통해 이메일 주소를 확인해주면,
  - 상태가 확인됨으로 나온다.
  - 이제 해당 이메일 주소로 알림을 받을 수 있는 상태가 된 것이다.

---

## 4. (실습) EC2 부하 테스트 및 경보 알림받기

EC2 부하 테스트 및 경보 알림을 실제로 받아보도록 하겠다.

[EC2] → [인스턴스]에 Public IPv4 주소를 복사해서 SSH로 접속해야 한다.

```bash
# SSH로 접속
$ sudo ssh -i [key-pair 파일위치] ubuntu@[복사한퍼블릭IPv4주소]

# 패키지 목록을 업데이트
$ sudo apt-get update

# 말 그대로 컴퓨터에 스트레스를 주는 프로그램
# 즉, 컴퓨터 샤용량을 계속 늘려 부하를 주는 프로그램
# 오토스케일링 실습에서도 사용했음
$ sudo apt-get install stress

# 버전확인
$ stress --version

# CPU 부하 테스트 시작!
# (명령어 실행하고, 5분 이상 이 상태로 두기 바란다.)
$ stress --cpu 4
```

그리고 시간이 어느 정도 지난 이후에 EC2 인스턴스의 [모니터링] 탭을 확인해보면,

- CPU 사용률이 치솟은 것을 볼 수 있다.
  - 이걸 눌러서 크게 확대해본다.
  - 이 상태에서 시간이 조금 더 지나면, CPU 사용률이 99%까지 올라간다.
- 설정한 대로 평균 CPU 사용률 80%가 5분 이상 지속되면 경보 알림이 발생한다.
- 이렇게 이메일로 직접 생성한 경보와 관련된 내용을 받아볼 수 있다.
