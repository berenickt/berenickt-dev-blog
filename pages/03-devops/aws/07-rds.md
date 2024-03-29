---
title: '07-RDS'
date: 2024/01/10
---

## 1. RDS

- RDS는 **Relational Database Service**의 약자
  - AWS에서 관계형 데이터베이스를 제공해주는 서비스
- 하지만 단순히 관계형 데이터베이스만을 제공해주는 것이 아니라 **DB와 관련된 모든 작업들을 제공**
- 그래서 RDS를 Fully Managed Relational Database(완전 관리형 관계형 데이터베이스)라고 부름
- 완전 관리형이기 때문에 데이터베이스와 관련된 모든 작업을 다 해준다.
- Oracle, MySQL, PostgreSQL, MariaDB, Aurora 등 다양한 DB엔진을 제공한다.
- 직접 하려면 번거로운 DB 이중화 작업이나 Read Replica 생성도 손쉽게 할 수 있다.
  - Multi-AZ의 AZ는 Availability Zone. 즉, 가용 영역을 의미
  - 그래서 Multi-AZ라고 하면 **복수 개의 가용 영역에 DB 인스턴스를 둠으로써 이중화하는 것**을 의미
- 인스턴스 확장 역시 쉽게 할 수 있다.

---

## 2. RDS를 사용하는 이유

다음 두 가지 경우를 비교했을 때, 어떤 경우에 우리가 직접 해야할 일들이 많을까?

- `EC2 같은 서버에 직접 DB를 설치해서 사용하는 경우` vs `RDS를 사용하는 경우`
- DBA(Database Administrator)는 데이터베이스 관리자로 DB 관련된 작업들만 전담한다.
  - 즉, 데이터베이스를 관리하는 것만 해도 할 일이 굉장히 많다.
  - e.g. DB 설치, 업그레이드, 마이그레이션, 백업 및 복구, 보안 설정, 스토리지 용량 계획 세우기, 성능 모니터링 및 튜닝, 문제해결 등
- RDS를 사용할 경우 모든 일들을 알아서 처리해주기 때문에, 신경쓸게 적어지고 편해진다.

---

## 3. RDS 기본 구조

![rds_structure](https://raw.githubusercontent.com/berenickt/image-server/main/img/rds_structure.jpeg)

AWS 리전과 가용 영역이 나타나 있고, 그 중 가용 영역 1번에 M이라고 써있는 **Master DB 인스턴스**가 있다.

- 이 Master DB를 통해 **읽기와 쓰기 작업**이 이뤄진다.
- cf. Master DB는 **Primary DB**라고 부르기도 함.

그리고 같은 리전 내에 다른 가용 영역에 S라고 써있는 **Standby DB**가 있다.

- 위 그림에서는 현재 2번 가용 영역에 존재한다.
- Standby DB는 데이터를 읽거나 쓰는 용도로 사용하는 것이 아닌,
  - 장애를 예방하기 위해서 **DB 이중화 작업**을 위해 사용한다.
  - 앞에서 잠깐 등장했던 Multi-AZ가 바로 이것이라고 보면 됩니다.
  - Standby라는 단어의 의미 그대로 대기 중인 인스턴스이다.

Master DB의 데이터는 Standby DB로 **동기 복제**가 이뤄진다.

- 그래서 Master DB와 Standby DB는 모든 시점에 모든 데이터가 동일하다고 볼 수 있습니다.

그리고 R이라고 써있는 인스턴스는 `Read Replica(읽기 전용 복제본)`이다.

- 데이터를 쓰는 용도가 아닌 **읽기만 하는 용도로 사용하는 인스턴스**다.
- Read Replica는 Master DB와 같은 리전에 있을 수도 있으며, 다른 리전에 존재할 수도 있다.
- 다른 리전에 Read Replica를 사용함으로써, 멀리 떨어져 있는 국가에서도 빠르게 데이터를 읽을 수 있다.

그리고 Master DB의 데이터는 Read Replica로 **비동기 복제**가 이뤄진다.

- 그래서 Master DB에 있는 데이터가 항상 Read Replica에 있다고는 할 수 없지만,
- 비동기 복제 자체가 굉장히 짧은 시간 내에 이뤄지기 때문에 거의 동일하게 데이터가 유지된다고 봐도 됩니다.

![rds_failover](https://raw.githubusercontent.com/berenickt/image-server/main/img/rds_failover.jpeg)

그리고 만약 위 그림처럼 Master DB에 장애가 발생하게 되면 장애를 극복하기 위한 `Failover`가 이뤄진다.

- 이때 Standby DB가 Master의 역할을 하게 된다.
- 그래서 읽기와 쓰기 작업이 Standby DB를 통해 이뤄진다.

---

### 3.1 다중 AZ와 읽기 전용 복제본 비교

|                  다중 AZ 배포                  |                      읽기 전용 복제본                      |
| :--------------------------------------------: | :--------------------------------------------------------: |
|           동기식 복제 - 높은 안정성            |                비동기식 복제 - 높은 확장성                 |
|    기본 인스턴스의 데이터베이스 엔진만 활성    |  모든 읽기 전용 복제본은 접근이 가능하며 읽기 확장도 가능  |
|         자동 백업은 대기 상태에서 수행         |                 기본 제공된 백업 구성 없음                 |
|  단일 지역 내에 항상 2개의 가용성 영역을 확장  |     가용 영역, 교차 AZ 또는 교차 지역 내에있을 수 있음     |
| 기본 데이터베이스 엔진 버전 업그레이드가 발생  | 데이터베이스 엔진 버전 업그레이드는 원본 인스턴스와 독립됨 |
| 문제가 감지되면 대기 모드로 자동 Failover 조치 |    독립형 데이터베이스 인스턴스로 수동 승격 될 수 있음     |

- AWS에서 만든 RDS 공식 소개영상 : https://www.youtube.com/watch?v=eMzCI7S1P9M&feature=youtu.be

---

## 4. (실습) RDS 인스턴스 생성

[RDS] → 대시보드 아래에 [데이터베이스 생성] 버튼을 클릭하면, 데이터베이스를 생성하기 위한 화면이 나온다.

- `엔진옵션` : MySQL 선택
- `템플릿` : 프리티어 선택
  - 프리티어를 선택하게 되면, 밑에 나오는 배포 옵션이 비활성화됨
- `설정`
  - DB 인스턴스 식별자 : my-database
  - 마스터 사용자이름은 admin
  - 암호자동생성 체크
- `인스턴스 구성` : db.t3.micro 프리티어 설정 그대로 두기
- `스토리지 유형` : 그대로 두기
- `연결` :
  - 퍼블릭 액세스를 예로 체크
  - VPC 보안 그룹(방화벽)을 새로 생성 체크
  - 새 VPC 보안 그룹 이름은 rds-my-database
- 데이터베이스 인증, 모니터링 등의 설정은 그대로 두기
- 이제 화면을 제일 끝까지 내리면, 예상 요금이 나온다.
- [데이터베이스 생성] 버튼을 클릭

> cf. EC2 인스턴스를 생성과 달리 RDS 인스턴스 생성은 시간이 꽤 걸린다.
>
> 대략 5분에서 10분 정도는 기다려야 정상적으로 사용할 수 있는 상태가 된다

중요한 것이 하나 있는데 위에 나오는 파란 부분을 닫지 말고,

- 오른쪽 상단에 있는 [자격증명 세부정보 보기] 버튼을 클릭.
- 그러면 DB 인스턴스에 접속할 수 있는 마스터 사용자의 이름과 암호가 나온다.
  - 여기서 중요한 것은 지금이 이 암호를 볼 수 있는 유일한 기회이기 때문에,
  - 꼭 암호를 잘 복사해둬야 한다. ⭐️
- 이후 시간이 조금 더 지나면, db 인스턴스의 상태가 백업 중으로 바뀌고,
- 조금 더 시간이 지나면 이렇게 [사용 가능] 상태로 바뀌게 된다.

그리고 dbinstance를 눌러서 들어가 보면,

- dbinstance에 관한 상세 정보들이 나오는데, [연결 및 보안] 탭의 밑에서 엔드포인트도 확인할 수 있다.
- 이 주소가 바로 dbinstance에 접속하기 위한 주소다.
- 뒤에 나올 실습에서 이 엔드포인트를 사용하기 때문에 이 부분도 잘 기억해두기

지금까지 만든 구조는 리전 내에 하나의 가용 영역에 master dbinstance를 생성한 것이다.

---

## 5. (실습) DB 인스턴스 다중 AZ 배포로 전환

> cf. 다중 AZ 배포를 사용하면 약간 과금이 될 수 있기 때문에,
> 과금이 걱정되면, 실습을 진행하지 않고 강의만 보고 어떻게 하는지만 파악해도 된다.

먼저 생성해둔 [DB 인스턴스] 상세 페이지에서 [구성] 탭을 클릭.

- 구성 탭에서 화면을 밑으로 내리다 보면, 다중 에이지 설정 상태가 나온다.
  - 지금은 다중 에이지를 설정하지 않았기 때문에 아니요라고 되어 있다.
- 다시 화면을 위로 올려서 오른쪽 상단에 있는 [작업] 메뉴를 클릭하고,
  - 하위 메뉴 중에서 [다중 AZ 배포로 변환]을 클릭
  - 그러면 확인 다이얼로그가 나오는데, 즉시 적용을 선택하고,
  - 오른쪽 하단에 있는 [다중 AZ로 변환] 버튼을 클릭
  - cf. 다중 AZ로 변환하는 작업도 생각보다는 시간이 꽤 걸린다.
- [로그 및 이벤트] 탭을 클릭하면,
  - 그러면 최근 이벤트를 볼 수 있는데,
  - 여기에 멀티 AZ로 변환한 이벤트도 나오는 것을 볼 수 있다.
- 그리고 어느 정도 시간이 지나면,
  - 인스턴스의 [구성] 탭에서 다중AZ 부분이 예 라고 바뀐 것을 볼 수 있다.

이번에는 DB 인스턴스를 장애 조치로 재부팅해본다.

- 오른쪽 상단에서 [작업] 메뉴를 클릭하고, 하위 메뉴 중에서 [재부팅]을 클릭
- 그리고 나오는 화면에서 [장애 조치로 재부팅]을 체크
- 체크한 뒤에 [확인] 버튼을 클릭.
- 그러면 이렇게 인스턴스 재부팅이 시작된다.

재부팅이 완료된 이후에 [로그 및 이벤트] 탭을 클릭해보면,

- 최근 이벤트 목록에서 멀티 AZ 인스턴스 FailOver가 시작되었고,
- 완료된 기록을 볼 수 있다.
- cf. 대략 1분 내로 페일오버가 완료된 것을 볼 수 있다.

우리가 지금까지 만든 구조는

- 멀티AZ를 적용함으로써 마스터디비(M) 인스턴스와
- 다른 가용 영역에 스탠바이디비(S) 인스턴스가 생성되었고
- 마스터디비(M)의 데이터는 스탠바이(S) 디비로 동기 복제가 이뤄진다.

cf. [AWS RDS 멀티AZ 소개 영상](https://www.youtube.com/watch?v=_MROZtLtCcA)

---

## 6. (실습) 다른 리전에 읽기 전용 복제본 생성

[RDS] → [데이터베이스] 인스턴스 목록에서 생성해둔 인스턴스를 클릭.

- 해당 인스턴스 상세 페이지에서 오른쪽 상단의 [작업] 메뉴를 클릭
- 그리고 나오는 하위 메뉴에서 [읽기 전용 복제본 생성]을 클릭

---

(읽기 전용 복제본 생성) 페이지

- `DB 인스턴스 식별자` : my-database
- `인스턴스 구성` : db.t3.micro를 그대로 사용
- `AWS 리전` : 가장 위에 있는 US East North Virginia를 선택
  - 리전을 변경하면, 다시 화면이 로딩된다.
  - cf. 여기서 현재 리전과 다른 리전을 선택해야 함 (서울 리전으로 진행중)
- `스토리지` : 기본 설정 그대로 사용
- `가용성` : 다중 AZ를 선택하는 부분에서 단일 DB 인스턴스를 선택
  - cf. 주의할 점은 만약 다중 AZ를 선택하면 요금이 과금될 수 있다.
  - 그래서 꼭 단일 DB 인스턴스를 선택
- `연결` : Public Access 가능을 선택
- `데이터베이스 인증` : 그대로 두기
- 화면을 제일 하단으로 내려서 [읽기 전용 복제본 생성] 버튼을 클릭

그럼 읽기 전용 복제본 생성이 시작됩니다.

- 기존 마스터 DB의 인스턴스 상태가 [수정 중]으로 바뀐다.
- 어느 정도 시간이 지나면, [사용 가능]으로 상태가 바뀐다.

DB 인스턴스를 눌러서, 상세 페이지로 이동한다.

- 상세 페이지의 [연결 및 보안] 탭에서 화면을 아래로 내려보면,
- 복제라는 부분에, 방금 생성한 읽기 전용 복제본이 나온다.
- 이 읽기 전용 복제본을 클릭
- 그러면 이렇게 데이터베이스 목록 화면이 나온다.
- 얼핏 봤을 때는 뭔가 기존과 다른 부분이 없어보이지만,
  - 오른쪽 상단에 현재 리전이 버지니아 북부로 바뀐 것을 볼 수 있다.
  - 그리고 DB 인스턴스의 역할이 복제본이라고 되어 있는 것도 볼 수 있다.
- 현재 화면에 보이는 db 인스턴스는 버지니아 북부에 있는 읽기 전용 복제본이다.

우리가 지금까지 만든 구조는

- 하나의 리전 내에 있는 가용 영역에 마스터DB 인스턴스가 존재하고,
- 마스터DB와 같은 리전 내에 다른 가용 영역에 standbyDB 인스턴스가 존재한다.
- 마스터DB와 다른 리전의 읽기 전용 복제본인 Read Replica가 존재하며,
  - Read Replica를 통해 읽기 작업을 수행할 수 있다.
- 마스터DB의 데이터는 Read Replica로 비동기 복제가 이뤄진다.

---

## 7. (실습) MySQL Workbench 설치 및 연결

먼저 구글에서 이렇게 MySQL Workbench라고 검색한다.

- 이후 검색 결과에서 제일 처음에 나오는 Download MySQL Workbench를 클릭.
  - 쿠키 설정창은 모두 승인을 눌러서 닫아준다.
  - 이후 내 컴퓨터의 운영체제와 OS 버전에 맞는 것을 다운로드한다.
  - 그러면 이렇게 설치 파일이 다운로드된다.
  - 다운받은 설치 파일을 실행해서 프로그램을 설치한다.
- MySQL Workbench를 설치하고 실행한다.
  - 플러스 아이콘으로 되어 있는 커넥션 추가 버튼을 클릭
- 그러면 새로운 연결 정보를 입력하는 다이얼로그가 나옵니다.
- 여기에 보면 여러가지 정보를 입력하도록 되어 있는데, 여기서 정보를 입력한다.
  - `Connection Name` : my-database-connection
  - `HostNmae` : AWS RDS DB 인스턴스의 엔드 포인트를 복붙
    - cf. my-database.cneigewmemxh.ap-northeast-2.rds.amazonaws.com
  - `Username` : DB 인스턴스를 생성할 때 기본 값인 admin을 사용했기 때문에 admin을 입력
  - 이후 [Store in Keychain] 버튼을 클릭.
- 그럼 새로운 다이얼로그가 하나 뜨는데, 여기서 이전에 복사해둔 마스터 사용자 비밀번호를 복붙한다.
  - 이렇게 비밀번호를 붙여넣고 OK 버튼을 누른다.
  - 이후 오른쪽 하단에 있는 테스트 커넥션을 눌러서 연결이 잘 되는지 미리 테스트한다.
  - 정상적으로 연결이 되었다면 이렇게 연결이 성공했다는 메시지가 나온다.
  - cf. 만약 연결이 되지 않을 경우, 보안 그룹 규칙을 한번 확인해 보기 바랍니다.
  - cf. 많은 분들이 보안 그룹 규칙 때문에 접속되지 않는 경우가 많다.
  - 연결이 성공하면, 오른쪽 하단의 OK 버튼을 누르면 연결 정보가 MySQL Workbench에 저장된다.
- 연결 목록에 새로운 연결이 생기게 되고, 이걸 누르면 곧바로 DB에 접속할 수 있다.
  - 이 버튼을 한번 누르면, DB에 접속되는 것을 볼 수 있다.
  - 여기서 왼쪽에 있는 [Server Status]를 눌러보면, 현재 서버의 상태와 요약 정보가 나온다.

---

## 8. (실습) WordPress DB 테이블 생성

- https://github.com/soaple/first-met-aws-practice/blob/master/chapter_07/backup.sql
- 링크에 접속해 WordPress DB 생성 쿼리문을 복사한다.
- 이 쿼리들은 WordPress의 기본 DB 스키마를 생성해주는 쿼리문이다.
  - cf. 여기에 wp\_\_users라는 테이블에 기본 사용자의 ID와 비밀번호가 포함되어 있다.
- 다음으로는 MySQL Workbench로 RDS 인스턴스에 접속한 뒤에
  - 복사한 쿼리문을 붙여넣고, [번개모양 아이콘]을 클릭해서 전체 쿼리문을 실행한다.
  - 쿼리문을 실행하면, 하단에 각 쿼리문의 실행 결과가 출력된다.
- 모든 쿼리 실행이 완료되면, 왼쪽 메뉴에 [Schemas] 탭을 클릭한다.
- 이후 `bitnami_wordpress`라는 스키마와 테이블들이 제대로 생성되었는지 확인한다.
  - 만약 스키마나 테이블이 보이지 않는다면, [새로 고침] 버튼을 클릭.

---

## 9. (실습) WordPress의 MySQL 연결 정보

이전에 했던 것과 동일한 방식으로 SSH를 사용하여 WordPress 인스턴스에 접속

```bash
$ ssh -i [key-pair경로] bitnami@[퍼블릭IPv4]

bitnami@ip-172-31-43-30:~$ vim /opt/bitnami/wordpress/wp-config.php
```

- 이때 접속하는 인스턴스는 현재 실행 중인 인스턴스 중 아무거나 하나에 접속하면 된다.
- 이후 `wp-config.php` 파일을 vim 편집기로 연다.
  - cf. vim은 유닉스 환경에서 텍스트를 편집하기 위한 프로그램.
  - GUI 환경이 없는 서버에서 많이 사용

> 💡 vim 에디터 사용법
>
> - 커맨 모드(기본 모드) - 입력모드에서 ESC
> - 입력모드 - i키
> - 나가기 : 커맨드 모드에서 :q 입력(quit)
> - 저장 및 나가기 : 커맨드 모드에서 :wq 입력 (write and quit)

- 방향키를 이용해서 아래로 내려가다 보면 이렇게 40에서 60번째 줄 사이에
  - 데이터베이스 접속 정보가 적혀 있는 부분이 나온다.
  - i키를 눌러서 입력 모드로 변경한 뒤, 총 3가지 정보를 변경한다.
  - db-user, db-password, db-host를 각자의 환경에 맞게 입력한다.

```
/** Database username */

define( 'DB_USER', 'admin' );


/** Database password */

define( 'DB_PASSWORD', 'pVjkJeIXeKF8IVmZTkE4' );


/** Database hostname */

define( 'DB_HOST', 'my-database.cneigewmemxh.ap-northeast-2.rds.amazonaws.com' );
```

모든 정보를 수정했다면 esc키를 눌러서 Command 모드로 변경한 뒤에 `:wq`를 입력해서 파일을 저장하고 밖으로 나간다.

이후 변경된 접속 정보를 적용하기 위해서는 Bitnami 서비스를 재시작해야 한다.

- 하지만 이 명령어를 실행하기 전에 먼저 새로운 AMI를 생성해야 한다.
- 그래서 명령을 실행하지 말고 다음 실습을 곧바로 이어서 진행한다.

```bash
bitnami@ip-172-31-43-30:~$ sudo service bitnami restart
```

---

## 10. (실습) 새로운 AMI 생성

EC2 인스턴스 목록에서 이전 실습에서 접속 정보를 변경한 인스턴스를 선택한다.

- 오른쪽 상단의 [작업] → [이미지 및 템플릿] → [이미지 생성] 메뉴를 클릭한다.
- 그럼 AMI를 생성하기 위한 화면이 나온다.

---

### 10.1 (이미지 생성) 페이지

- `이미지 이름` : MyWordpressAMI-New
- 화면을 밑으로 내려서 [이미지 생성] 버튼을 클릭

왼쪽에 있는 [AMI] 메뉴를 클릭해서 이미지를 확인한다.

- 방금 생성 요청한 이미지를 상세보기 해보면, 현재 상태는 [대기 중]으로 나온다.
- 이 상태에서 시간이 조금 지나면, [사용 가능]으로 상태가 변경된다.

---

## 11. (실습) RDS 보안 그룹 규칙 변경

보안 그룹 규칙을 변경하는 이유는 처음에 RDS 인스턴스를 생성했을 때,
외부에서 아무나 접근 가능하도록 규칙이 설정되어 있지 않기 때문이다.

[RDS] → [데이터베이스] → 인스턴스 상세 페이지에서 [연결 및 보안] 탭에 접속한다.

- 여기서 보안이라고 되어 있는 부분을 보면,
  - 현재 RDS와 연결되어 있는 보안 그룹 링크를 볼 수 있습니다.
  - 이 링크를 눌러서 들어가본다.
- 그러면 보안그룹 페이지에 해당 보안그룹만 필터링되어 나오게 된다.
  - 해당 보안 그룹을 체크해 상세정보를 본다.
  - 여기서 [인바운드 규칙 편집] 버튼을 클릭.
- 그러면 Inbound 규칙이 나오는데,
  - [소스]가 [내 IP]라고 되어 있는 것을 볼 수 있다.
  - 그래서 지금은 내 IP에서만 DB 인스턴스에 접근할 수 있다.
  - 이 메뉴를 클릭해서 Anywhere-IPv4를 선택.
- 그러면 이제 모든 IP에서 3306 포트를 이용하여 DB 인스턴스에 접근할 수 있게 된다.
- 규칙을 수정했다면 [규칙 저장] 버튼을 클릭.
- 그러면 보안그룹 규칙 편집이 완료됩니다.

---

## 12. (실습) 새로운 시작 템플릿 생성

[EC2] → 왼쪽에 있는 메뉴 중에서 [시작 템플릿] 메뉴로 이동한다.
이후 오른쪽 상단에 있는 [시작 템플릿 생성] 버튼을 클릭.

(시작 템플릿 생성) 페이지

- `시작 템플릿 이름` : MyTemplateNew
- `Application and OS Images`
  - 여기서 내 AMI 탭을 클릭.
  - 여기서 AMI 목록을 클릭.
  - 그리고 나오는 AMI 중에서 앞에서 새로 생성한 AMI를 선택한다.
    - cf. MyWordpressAMI-New
  - 이 AMI는 WordPress DB 정보가 RDS 인스턴스를 바라보도록 변경된 AMI다.
- `인스턴스 유형` : 프리티어 사용 가능이라고 표시되어 있는 T2.micro를 선택
- `키 페어` : 이전 실습과 동일한 키페어를 선택
- `보안그룹` : [보안 그룹 선택] 메뉴를 클릭.
  - 이후 보안 그룹 목록에서 WordPress 보안 그룹을 선택.
  - cf. WordPress Certified by Bitnami ~~~
- 나머지 설정은 그대로 두고 오른쪽 하단에 있는 [시작 템플릿 생성] 버튼을 클릭

[시작 템플릿 보기] 버튼을 한번 눌러보면, 방금 생성한 시작 템플릿을 포함해서 총 2개의 시작 템플릿이 나오는 것을 볼 수 있다.

---

## 13. (실습) Auto Scaling Group의 시작템플릿 변경

[EC2] → 왼쪽 메뉴에서 [오토스케일링 그룹] 메뉴를 클릭해서 상세페이지로 이동한다.

- 상세 정보 페이지가 나오면, [시작 템플릿] 섹션의 오른쪽에 [편집] 버튼을 클릭.
  - 그럼 시작 템플릿을 변경할 수 있는 화면이 나온다.
- 여기서 [시작 템플릿 선택] 메뉴를 클릭합니다.
  - 그러면 목록에 이렇게 총 2개의 시작 템플릿이 나오는 것을 볼 수 있다.
  - 여기서 새로 만든 시작 템플릿을 선택한다. (cf. MyTemplateNew)
  - 이후 화면을 제일 하단으로 내려서 [업데이트] 버튼을 클릭한다.
- 그러면 이렇게 오토스케일링 그룹의 시작 템플릿이 변경된 것을 볼 수 있다.

---

## 14. (실습) RDS 정상 작동 테스트

기존에 실행 중인 EC2 인스턴스들은 모두 자체 DB를 바라보고 있기 때문에 종료하고, 새로운 인스턴스를 생성해야 한다.

- 그래서 EC2 인스턴스 목록에 들어가서 모든 인스턴스를 선택한다.
  - 이후 [인스턴스 상태] 메뉴에서 [인스턴스 종료] 메뉴를 클릭한다.
  - 그러면 확인 다이얼로그가 나오고, [종료] 버튼을 클릭한다.
- 모든 인스턴스의 상태가 [종료 중]으로 바뀌게 되고, 일정 시간이 지나면 종료된다.
- 그렇게 모든 인스턴스가 종료되고, 몇 분이 지나면 새로운 EC2 인스턴스가 자동으로 실행된다.
  - 이렇게 되는 이유는 오토스케일링 그룹에 Healthy 상태인 인스턴스가 없기 때문에
  - 인스턴스를 자동으로 생성하기 때문이다.
- 그래서 [EC2] → [Auto Scaling 그룹] 페이지에 접속해서
  - [활동] 탭을 클릭해보면 작업 기록에서 새로운 EC2 인스턴스가 실행된 것을 확인할 수 있다.
  - [인스턴스 관리] 탭에 가보면, 새로운 시작 템플릿을 사용해서 생성된 EC2 인스턴스가 나오는 것을 볼 수 있다.
  - 그리고 EC2 인스턴스 목록에서도 새로 실행된 인스턴스들을 확인할 수 있다.

이제 ELB의 DNS 이름으로 한번 접속해 보겠다.

- [로드 밸런서] 페이지에 접속해서 우리가 만든 ELB를 선택한다.
- 그리고 상세 정보 하단에 나오는 DNS 이름을 복사합니다.
- DNS 이름을 브라우저 주소창에 복붙하면 WordPress 페이지가 나온다.

이번에는 실행 중인 인스턴스 중 하나를 선택해서 글을 작성해보자.

- 인스턴스 하나를 선택하고 Public IPv4 주소를 복사합니다.
- 복사한 IP 주소 뒤에 `/admin`을 붙여서 관리 페이지로 접속합니다.
- RDS의 WordPress DB 스키마를 생성할 때,
  - 기본 사용자 이름은 user, 비밀번호는 1234로 되어 있다.
  - 입력창에 입력하고 로그인 버튼을 클릭한다.
- 이후 새로운 글을 작성하기 위해서 왼쪽 포스트 메뉴에서 Add New를 클릭합니다.
- 글을 작성한 화면이 나오면, 글의 제목과 내용을 작성한 뒤에
  - cf. 제목 : 모든 인스턴스에서 보일까요
  - 오른쪽 상단에 있는 Publish 버튼을 클릭해서 글을 등록한다.
- 글 작성이 완료되었다면, ELB의 DNS 이름으로 다시 접속한다.
  - 그러면 새로 작성한 글이 목록에 잘 나오는 것을 볼 수 있다.
- 그리고 MySQL Workbench에서 `wp_posts`라는 테이블을 조회해보면,
  - 작성한 글이 테이블에 잘 들어가 있는 것을 볼 수 있다.

---

### 14.1 지금까지 만든 구조

```
ELB ⎯⎯⎯⎯> (EC2, WordPress) ⎯⎯⎯⎯> ( RDS, MySQL )
    ⎯⎯⎯⎯> (EC2, WordPress) ⎯⎯⎯⎯>
```

- MySQL 서버가 각 인스턴스 내에서 돌아가는 것이 아니라,
- RDS를 사용해서 별도의 DB 인스턴스에서 돌아가도록 만들고,
- 모든 EC2 인스턴스들이 해당 DB를 바라보도록 만든 것
- 그래서 어느 인스턴스에서 글을 작성하든지,
  - 데이터는 하나의 DB에 저장되고 관리된다.
