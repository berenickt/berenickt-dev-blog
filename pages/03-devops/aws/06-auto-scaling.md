---
title: '06-Auto Scaling'
date: 2024/01/10
---

## 1. Auto Scaling

- `Auto Scaling` : 자동으로 크기를 조절한다는 뜻
  - **트래픽에 따라서 자동으로 서버의 개수를 조절해주는 기능**을 의미
  - AWS 관점에서는 **트래픽에 따라서 자동으로 EC2 인스턴스 개수를 조절해주는 기능**을 의미

보통의 경우에는 서버의 최대 용량이 고정되어 있다. 하지만 **서버로 들어오는 트래픽의 양은 고정되어 있지 않다.**

- 그래서 갑자기 서버에 트래픽이 몰리게 되면,
- 빨간 점섬으로 표시한 부분처럼 서버 용량 초과로 인해 서버에 장애가 발생한다.

그래서 이러한 상황을 방지하고자, 서버의 최대 용량을 확 늘리는 방법을 사용할 수도 있다.

- 하지만 이렇게 되면, 평소 트래픽이 몰리지 않을 때에도 서버의 용량을 크게 유지해야 하기 때문에,
  - 이처럼 **낭비되는 자원**이 많이 생기게 됩니다.
- 이러한 상황에서 서비스를 안정적으로 제공하면서 낭비되는 자원이 없도록,
  - 비용 효율적으로 하기 위해서 등장한 것이 바로 **Auto Scaling**이다.

Auto Scaling을 사용하게 되면, 실제 트래픽과 거의 유사한 수준으로 서버의 용량을 조절할 수 있다.

- 이렇게 되면 트래픽이 늘어나도 서버의 용량이 자동으로 늘어남으로써 안정적으로 서비스를 제공할 수 있다.
- 또한 트래픽이 줄어들면 서버의 용량도 자동으로 줄어듦으로써 낭비 되는 자원이 생기지 않도록 할 수 있다.
- 그래서 Auto Scaling을 사용하면 안정적이며 효율적으로 서버를 운영할 수 있다.
- cf. Auto Scaling은 앞에서 배운 **ELB와 함께 사용**한다.

---

## 2. Auto Scaling 기본구조

![auto_scaling_structure](https://raw.githubusercontent.com/berenickt/image-server/main/img/auto_scaling_structure.jpeg)

- 앞에서 Auto Scaling은 ELB와 함께 사용한다고 했었죠?
- 그래서 이처럼 클라이언트의 요청이 ELB로 들어오게 되고,
- 로드 밸런서에서 **ASG**라고 부르는 **Auto Scaling Group**으로 부하를 분산시키게 된다.
- Auto Scaling Group은 **Amazon Machine Image**를 필요로 하며,
  - **CloudWatch**라는 클라우드 모니터링 서비스를 사용해서 서버의 용량을 늘릴지 줄일지 결정한다

---

### 2.1 Auto Scaling Group

- `ASG(Auto Scaling Group)` : Auto Scaling되는 EC2 인스턴스들의 집합을 의미
- 그래서 우리가 사전에 설정한 값에 따라서 EC2 인스턴스를 늘였다 줄었다 하게 된다.
- 그리고 Cloud Watch라는 AWS의 서비스들을 모니터링하는 서비스와 연동함으로써,
  - 다양한 지표에 따라 인스턴스 개수를 조절할 수 있습니다.

---

### 2.2 Launch Configuration

- Auto Scaling을 설정하기 위해서는 `Launch Configuration(시작 구성)`을 생성해야 한다.
- 시작 구성은 **EC2 인스턴스를 시작하기 위한 구성**을 의미하는데,
  - Auto Scaling을 할 때 사용하는 EC2 인스턴스의 사전 설정 정보라고 이해하면 된다.
- 그래서 시작 구성을 만드는 과정은 EC2 인스턴스를 만들 때 설정하는 정보들을 선택하는 과정과 동일하다
  - AMI(Amazon Machine Image)를 선택
  - 인스턴스 유형(e.g. t2.large, m4.large)
  - 스토리지 (EBS)
  - 보안 그룹 (Security Group) 등을 사전에 미리 선택
- 그리고 현재는 시작 구성과 동일한 역할을 하는 **시작 템플릿**이라는 것을 주로 사용한다.
  - cf. 뒤에서 나올 실습에서 이 시작 템플릿을 사용할 예정

---

## 3. (실습) WordPress EC2 인스턴스 1개종료

이전 실습에서 생성해 놓은 WordPress EC2 인스턴스 1개를 종료해본다.

먼저 [EC2] → [인스턴스] 페이지에 접속합니다.

- 두 번째로 생성한 WordPress Instance 2라고 되어 있는 EC2 인스턴스를 선택
- 오른쪽 상단에 있는 [인스턴스 상태] 메뉴를 클릭
- 하위 메뉴에서 [인스턴스 종료]를 클릭
- 확인 다이얼로그가 뜨게 되고, [종료] 버튼을 눌러서 인스턴스를 종료
- 인스턴스 종료가 시작되며, 일정 시간이 지나면, 인스턴스 상태가 [종료됨]으로 변경된다.

---

## 4. (실습) AMI 생성

오토 스케일링을 설정하기 위한 준비물 중 하나인 AMI를 생성해본다.

먼저 [EC2] → [인스턴스] 페이지에서 실행 중인 WordPress 인스턴스를 선택한다.

- 오른쪽 상단의 [작업] 메뉴를 클릭합니다.
- 이후 나오는 하위 메뉴에서 [이미지 및 템플릿] → [이미지 생성] 메뉴를 클릭

---

(이미지 생성) 페이지

- `이미지 이름` : MyWordpressAMI (구분할 수 있는 아무 이름)
- `재부팅 안함 옵션` : 체크 해제된채로 유지
  - cf. 일반적으로 이미지를 생성할 때는 EC2 인스턴스를 재부팅한다.
  - 하지만 재부팅 안함 옵션을 활성화하면,
  - 현재 러닝 중인 EC2 인스턴스를 재부팅하지 않고 AMI를 생성한다.
  - 인스턴스가 잠시라도 중단되면 안될 때, 이 옵션을 사용하면 되는데,
  - 대신 파일 시스템의 무결성을 보장하지 않는다는 특징이 있다.
- 화면을 아래로 쭉 내려서 오른쪽 하단에 있는 [이미지 생성] 버튼을 클릭

---

[EC2] → 왼쪽 메뉴 [이미지]의 [AMI] 페이지로 이동한다.

- 그러면 방금 생성 요청한 AMI가 목록에 나오는 것을 볼 수 있다.
- 이미지를 상세보기하면, 현재 상태는 [대기 중]으로 나온다.
- 시간이 조금 지나면 [사용 가능] 상태로 바뀐다.
- 이 상태가 되면, 이제 AMI를 사용할 수 있다.

---

## 5. (실습) Auto Scaling Group 생성

[EC2] → 왼쪽 메뉴 [Auto Scaling]의 [Auto Scaling 그룹] 페이지로 이동한다.

- 여기서 [오토스케일링 그룹 생성] 버튼을 클릭.
  - 그럼 총 7단계로 나눠져 있는 오토스케일링 그룹 생성 화면이 나온다.

---

### 1단계 시작 템플릿 선택

- `Auto Scaling 그룹 이름` : MyAutoScalingGroup
- 사전에 만들어둔 시작 템플릿이 없기 때문에, [시작 템플릿 생성]을 클릭

> 💡 (시작 템플릿 생성) 페이지
>
> 페이지 UI가 EC2 인스턴스를 생성할 때와 거의 유사하다.
> 시작 템플릿은 EC2 인스턴스를 생성하기 위한 설정들을 미리 해놓는 것이기 때문.
>
> - `시작 템플릿 이름` : MyTemplate
> - `Application and OS Images`
>   - 미리 생성해둔 AMI를 사용하기 위해서 [내 AMI] 탭을 클릭
>   - 그러면 내 소유의 AMI와 나와 공유된 AMI를 선택할 수 있는 화면이 나온다.
>   - 이전에 생성해둔 [MyWordPressAMI]를 선택
>   - cf. 화면을 아래로 스크롤하면, AMI를 선택할 수 있는 화면이 있다.
> - `인스턴스 유형` : 프리티어 사용가능 유형인 t2.micro 선택
> - `키페어` : 이전에 계속 사용하던 키페어를 선택
> - `네트워크 설정 - 보안그룹`
>   - 목록에서 이전에 WordPress 인스턴스를 생성할 때,
>   - 함께 생성된 보안 그룹을 선택
>   - cf. WordPress Certified by Bitnami ~~~
> - 나머지 스토리지와 태그 등은 필요한 경우 설정을 변경해서 사용
> - 모든 설정을 마쳤으면 오른쪽 하단에 있는 [시작 템플릿 생성] 버튼을 클릭
>
> 그러면 시작 템플릿이 생성된다. [시작 템플릿 보기] 버튼을 클릭
>
> - 설정한 대로 시작 템플릿이 만들어진 것을 확인할 수 있다.
> - cf. 시작 템플릿 페이지는 [EC2] 왼쪽 메뉴에서 [인스턴스] → [시작템플릿] 메뉴로 존재.
> - 시작 템플릿을 생성했다면 이제 다시 오토 스케일링 그룹 생성 페이지로 돌아온다.

- 오른쪽에 있는 새로 고친 버튼을 누른 다음, 시작 템플릿 선택 메뉴를 클릭
  - 목록에 만들어둔 시작 템플릿 이름이 나온다.
  - 이 시작 템플릿을 선택.
  - 시작 템플릿을 선택하면, 간단한 정보들이 나온다.
  - 정보를 확인하고 난 이후에 오른쪽 하단에 있는 [다음] 버튼을 클릭

---

### 2단계 인스턴스 시작 옵션 선택

[가용 영역 및 서브넷 선택] 메뉴를 클릭

- 그러면 서울리전에 있는 총 4개의 가용 영역이 나온다.
- ap-northeast2a와 ap-northeast2c를 선택
  - 주의할 점은 **ELB를 만들 때 생성했던 대상 그룹의 가용 영역과 동일하게 설정**해야 함
  - 그래야 오토스케일링 그룹으로 생성된 EC2 인스턴스가
  - 대상 그룹에 속하게 되어 트래픽을 전달받을 수 있기 때문.
- 가용 영역을 모두 설정했다면, 화면을 아래로 내려서 다음 버튼을 클릭

---

### 3단계 고급 옵션 구성

여기서 로드 밸런서와 오토 스케일링 그룹을 연결할 수 있다.

- 가운데에 있는 [기존 로드 밸런서의 연결] 옵션을 선택한다.
  - 그러면 기존 로드 밸런서의 대상 그룹을 선택하는 화면이 나온다.
- 여기서 [대상 그룹 선택] 메뉴를 클릭
  - ELB를 생성할 때 함께 생성했던 대상 그룹이 나온다.
  - 이 대상 그룹을 선택. (cf. MyTargetGroup | HTTP)
  - cf. 이렇게 되면 오토 스케일링으로 생성된 인스턴스가 대상 그룹에 속하게 되어,
  - 로드밸런서로부터 트래픽을 전달받을 수 있게 된다.
- 화면을 아래로 내려서 상태 확인을 설정해야 한다.
  - [Elastic Load Balancer 상태 확인 켜기] 옵션을 체크
  - 이 옵션은 말 그대로 ELB의 상태를 체크하는 것
  - cf. 만약 ELB의 상태가 정상이 아니라면,
  - 아무리 서버가 정상 상태여도 부하가 제대로 분산되지 않겠죠.
  - 그래서 ELB의 상태를 체크하는 것
- 화면을 아래로 내려서 [다음] 버튼을 클릭

---

### 4단계 그룹 크기 및 크기 조정 구성

여기서는 실제 오토스케일링 그룹의 크기와 조정 정책을 설정할 수 있다.

`그룹 크기 정책`

- 먼저 여기서 그룹의 최소 용량과 최대 용량을 설정한다.
- 여기 입력하는 숫자는 EC2 인스턴스의 개수라고 보면 된다.
- 원하는 용량1로 그대로 놔둔다.

`크기 조정 정책`

- 오토스케일링 그룹의 크기를 조정하기 위한 조건이다.
- 원하는 최소 용량을 1, 원하는 최대 용량을 2로 해서,
  - 오토스케일링이 작동하는지만 테스트할 것임
- [대상 추적 크기 조정 정책]을 선택
  - 정책 이름과 지표 유형을 선택할 수 있고,해당 지표의 대상값을 설정 가능
  - `지표 유형` : 평균 CPU 사용률
  - `대상값` : 80을 입력
  - cf. 이것의 의미는 평균 CPU 사용률이 80%가 넘으면 인스턴스 개수를 늘리고,
  - cf. 평균 CPU 사용률이 80% 밑으로 떨어지면 인스턴스 개수를 줄이겠다는 의미
  - cf. 여기서 조정되는 인스턴스의 개수는 앞에서 설정한 최소 최대 개수 범위 내에서만 조정됨
- 밑에 있는 [확대 정책만 생성하려면 축소 비활성화] 옵션은
  - 인스턴스 개수를 늘리기만 하고 줄이지는 않을 때 사용하는 옵션이다.
  - 이 옵션은 생성된 인스턴스를 계속 유지하고 싶을 때 사용한다
  - 오토 스케일링으로 생성된 인스턴스를 직접 확인하기 위해, [축소 비활성화 옵션]을 체크
- 화면을 내려서 [다음] 버튼을 클릭

---

### 5단계 알림 추가

알림을 추가하면 오토스케일링이 작동할 때마다 이메일 등으로 알림을 받을 수 있다.

- 이 부분은 필수는 아니기 때문에 설정해 보고 싶은 분들만 설정.
- 먼저 [알림 추가] 버튼을 누른다.
  - cf. SNS(Simple Notification Service)는 AWS에서 알림을 담당하는 별도의 서비스
- [SNS 주제 메뉴]를 클릭
  - 기존에 생성해둔 SNS 주제가 없을 것이기 때문에 새로 하나 생성해야 함
  - [주제 생성] 버튼을 클릭해, 이름과 이메일을 입력
  - SNS 주제가 생성된 이후에는 주제를 선택하면, 해당 주제로 알림이 전송된다.
- 알림까지 설정했다면 [다음] 버튼을 클릭

---

### 6단계 태그 추가

필요한 경우 여기서 태그를 추가하면 된다. [다음] 버튼을 클릭

---

### 7단계 검토

검토 단계에서는 지금까지 설정한 정보들을 확인할 수 있다.

- 혹시나 잘못 설정한 부분은 없는지 한번 쭉 확인해보기
- 모든 정보들을 검토했다면, 제일 하단에 있는 [Auto Scaling 그룹 생성] 버튼을 클릭

그러면 오토 스케일링 그룹이 생성되는 것을 볼 수 있다.

- 오토 스케일링 그룹을 선택하면, 하단에서 상세 정보를 확인할 수 있다.

---

## 6. (실습) Auto Scaling 작동 테스트

이전 실습에서 오토스케일링 그룹을 생성하고 나면, EC2 인스턴스가 하나 자동 생성된다.

> cf. 인스턴스가 하나 생성되는 이유는 오토스케일링 그룹의 최소 크기를 1로 설정했기 때문
>
> 오토스케일링 그룹의 크기는 로드 밸런싱의 대상 그룹과는 별개로 개수가 관리된다

오토스케일링으로 생성된 EC2 인스턴스를 선택해, 하단에 상세 정보가 확인한다

- [세부정보] 탭에 [AMI 이름] 부분에 우리가 직접 만든 AMI를 사용해서 EC2 인스턴스가 생성된 것을 볼 수 있다. (cf. MyWordpressAMI)
  - 오토 스케일링은 시작 템플릿에서 설정한 대로 EC2 인스턴스를 생성하기 때문
- 위로 올라와 [인스턴스 요약]정보 - 해당 인스턴스에 public ipv4 주소를 복사해서 ssh로 접속
- 그리고 이후에 터미널에서 ssh 명령어를 사용해서, 해당 EC2 인스턴스에 접속한다.
  - cf. 이때 사용자 이름은 ubuntu가 아니라 bitnami가 되어야 함
  - bitnami에서 만든 WordPress 이미지의 기본 사용자 이름이 bitnami이기 때문

```bash
$ ssh -i [key-pair파일경로] bitnami@[복사한퍼블릭IPv4주소]
? yes
# sudo ssh -i /~~~/my-key-pair.pem bitnami@13.125.189.206

bitnami@ip-172-31-14-125: ~$ sudo apt-get install stress
# stress는 말 그대로 컴퓨터에 스트레스를 주는 프로그램
# 컴퓨터 사용량을 계속 늘려서 부하를 주는 프로그램
# 오토스케일링의 작동 조건을 평균 CPU 사용률 80%로 설정해놨기 때문
# 오토스케일링을 작동시키기 위해서 스트레스라는 프로그램을 사용하는 것

bitnami@ip-172-31-14-125: ~$ stress --cpu 4
stress: info: [1613] dispatching hogs: 4 cpu, 0 io, 0 vm, 0 hdd
# 그러면 이제 EC2 인스턴스에 부하가 걸리기 시작한다.
# 오토 스케일링이 작동하기까지는 약간의 시간이 걸리기 때문에
# 이 상태로 5분 이상 두기 바란다.
```

스트레스를 실행시켜 놓은 상태로 CPU 사용률을 모니터링하기 위해서

- [EC2] 페이지에서 해당 인스턴스의 [모니터링] 탭을 클릭
- 제일 처음에 CPU 사용률이 나오는 부분에 커서를 올리면 확대 버튼이 나온다.
- [확대] 버튼을 클릭. 그러면 전체 화면으로 CPU 사용률을 볼 수 있다.
- 인스턴스가 생성된 지 얼마 안 된 시점에는 지표가 없기 때문에, 점 하나만 나온다.
- 일정 시간이 지나면 선이 생기는데,
  - 스트레스로 인해서 CPU 사용률이 99%를 넘은 것을 볼 수 있다.
- 이 상태로 조금 더 기다려 보면,
  - 인스턴스 목록에 새로운 EC2 인스턴스가 하나 더 추가된다.
  - 오토스케일링이 작동 조건을 만족했기 때문에, 새로운 인스턴스가 생성된 것.

왼쪽 메뉴 [오토스케일링 그룹] 페이지에서 만든 오토스케일링 그룹을 선택해서 상세 정보로 확인한다.

- [활동] 탭을 클릭.
  - 그러면 이렇게 활동 기록을 볼 수 있는데,
  - 새로운 EC2 인스턴스가 시작된 기록도 나와 있는 것을 볼 수 있다.
- [인스턴스 관리] 탭을 클릭
  - 그러면 현재 오토 스케일링 그룹에 인스턴스가 두 개 존재하는 것을 볼 수 있다.
  - 그리고 각 인스턴스의 유형, 가용 영역, 상태 등도 확인할 수 있다.

이번에는 왼쪽 메뉴 [로드 밸런싱] → [대상 그룹]을 확인해본다.

- 대상 그룹 페이지에서 만든 대상 그룹을 선택하고, [대상] 탭을 클릭
- 그러면 등록된 대상 목록에 총 3개의 인스턴스가 나오는 것을 볼 수 있다.
  - 이렇게 오토스케일링 그룹과 대상 그룹의 인스턴스 개수가 다른 이유는
  - 대상 그룹에는 수동으로 생성한 인스턴스가 하나 포함되어 있기 때문이다.
- `오토스케일링 그룹`은 오토스케일링 된 인스턴스만을 관리하기 위한 그룹이고
  - `대상 그룹`은 로드밸런서가 부하를 분산하기 위한 그룹이기 때문에
  - 두 그룹의 인스턴스들이 항상 일치하지는 않을 수 있다.
- 그리고 아까 알림을 설정한 분들은 이메일로 오토스케일링과 관련된 알림을 받아볼 수 있다.
  - cf. 이 알림은 SNS라는 서비스를 통해 발송된 것이라는 것

---

## 7. (실습) 블로그 접속해서 글쓰기

먼저 오토스케일링으로 생성된 인스턴스 중 하나를 선택하고 Public IPv4 주소를 복사

- 복사한 주소 뒤에 `/admin`을 붙여서 관리 페이지로 접속
  - 이전에는 사용자 아이디와 비밀번호를 시스템 로그를 통해서 알아냈지만,
  - 오토스케일링으로 생성된 인스턴스에서는 아이디와 비밀번호가 시스템 로그로 출력되지 않는다.

```bash
$ sudo ssh -i [로컬key-pair-파일경로] bitnami@[퍼블릭IPv4]
# sudo ssh -i ~~~/my-key-pair.pem bitnami@52.79.236.206

bitnami@ip-172-31-42-89:~$ cat bitnami_credentials
```

그래서 아이디와 비밀번호를 알아내기 위해서, 해당 인스턴스에 SSH로 접속한다.

- 접속한 이후에 cat 명령어를 사용해서,
- `bitnami_credentials`라는 파일의 내용을 화면에 출력.
  - cf. cat은 파일의 내용을 화면에 출력하는 명령어
- 화면에 출력된 내용을 보면 이렇게 사용자 이름과 비밀번호를 확인할 수 있다.
- 여기서 비밀번호를 선택해서 복사해서 관리자페이지에서 로그인한다.

새로운 글을 작성하기 위해서 왼쪽에 있는 Post 메뉴를 클릭한다.

- 하위 메뉴에서 Add New를 클릭
- 오토 스케일링으로 생성된 인스턴스인 것을 알 수 있도록 글을 작성
  - cf. Auto Scaling 인스턴스
- 글을 모두 작성한 뒤에 오른쪽 상단에 있는 [Publish] 버튼을 클릭
- 이후 한 번 더 [Publish] 버튼을 클릭해서 글을 작성
- 해당 글의 링크가 나오면, [View Post] 버튼을 클릭해서 글을 보기.

IP 주소가 아닌 ELB의 DNS 이름을 사용해서 접속해본다.

- [로드밸런서] 페이지에서 만든 ELB 로드밸런서를 선택하고,
  - 세부 정보 하단에 있는 DNS 이름을 복사.
  - 브라우저 주소창에 붙여넣기
- 그러면 이렇게 WordPress 블로그와 작성한 글이 나오는 것을 볼 수 있다.
- 계속 새로고침하다보면, 작성한 글이 안나오는 것을 볼 수 있다.
  - 이러한 경우가 발생하는 이유는
  - ELB에서 글을 작성하지 않은 다른 인스턴스로 부하를 분산시켰기 때문

```
ELB ⎯⎯⎯⎯> (EC2, MySQL, WordPress)
    ⎯⎯⎯⎯> (EC2, MySQL, WordPress)
```

오토스케일링은 되었지만, 서버마다 갖고 있는 데이터가 다르다면,

- 오토스케일링을 적용하는 것이 의미가 없다.
- 현재 적용된 구조는 각 EC2 인스턴스가 각각 따로 설치된 MySQL 서버를 사용 중인 상태다.
- 그래서 특정 인스턴스에서 글을 작성하면,
  - 그 글은 해당 인스턴스에 접속한 경우에만 볼 수 있다.

이 문제를 해결하기 위해서는 구조를 다음과 같이 변경해야 한다.

```
ELB ⎯⎯⎯⎯> (EC2, WordPress) ⎯⎯⎯⎯> MySQL
    ⎯⎯⎯⎯> (EC2, WordPress) ⎯⎯⎯⎯>
```

- MySQL 서버가 각 인스턴스 내에서 돌아가는 것이 아니라,
- 별도의 DB 인스턴스에서 돌아가도록 만들고,
- 모든 EC2 인스턴스들이 해당 DB를 바라보도록 하는 것이다.
- 다음 RDS 실습을 할 때, 이 구조를 직접 만들어 볼 예정이다.
