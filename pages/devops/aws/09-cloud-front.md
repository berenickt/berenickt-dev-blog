---
title: '09-Cloud Front'
date: 2024/01/10
---

## 1. CloudFront

* `CloudFront`는 `CDN(Content Delivery Network, 컨텐츠 전송 네트워크)` 서비스이다.
* CDN이 하는 역할은 이름 그대로 **콘텐츠를 전세계로 빠르게 전송할 수 있게 해주는 것**
* AWS에서 이 CDN의 역할을 하는 서비스가 바로 `CloudFront`

------

### 1.1 CloudFront 특징

* 콘텐츠 전송 네트워크(CDN)
* 콘텐츠(이미지, HTML)를 캐싱하여 성능 가속
* 전 세계 수 많은 Edge Location
* 글로벌 고속 백본 네트워크 확보
* AWS 서비스 <---> CloudFront 데이터 전송 무료
* DDoS 방어 무료 제공(AWS Shield Standard)

------

### 1.2 AWS Shield Standard

* AWS에서 실행되는 애플리케이션을 보호하는 DDoS 보호 서비스
* CloudFront에서는 AWS Shield Standard에 의한 L3/L4 DDoS 보호는 추가 비용 없이 포함된다.
* AWS는 전 세계에 400개 이상의 **엣지 로케이션**이 존재한다고 나와 있는데, 
  * 이 엣지 로케이션이 바로 CloudFront같은 CDN 서비스를 제공하기 위한 목적으로 사용된다.

------

### 1.3 CloudFront 기본 용어

* `배포(Distribution)`
  * **CloudFront의 가장 기본적인 단위**를 의미
  * 각 배포는 고유의 도메인을 가지게 되며, 
  * Route 53이라는 AWS의 DNS 서비스를 사용해서 자신이 구입한 도메인에 연결할 수 있다.
* `오리진(Origin)`
  * **원본 파일을 가져오는 위치**를 의미
  * 기본 설정은 S3로 되어 있으며, EC2, ELB, 외부서버 등으로 커스텀 설정도 가능하다

------

## 2. (실습) S3 버킷 생성





------

## 3. (실습) S3 버킷에 파일 업로드





------

## 4. (실습) CloudFront 배포 생성





------

## 5. (실습) CloudFront 배포 삭제
