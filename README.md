# PERA Projesi | PERA Project

## 🌐 Proje Amacı | Project Purpose

*Türkçe:*  
Pera, Web3 teknolojilerini öğretmeyi amaçlayan oyunlaştırılmış bir öğretici platformdur. Bu proje, kullanıcıların merkeziyetsiz teknolojilere daha hızlı adapte olmasını sağlamak için eğlenceli ve etkileşimli bir ortam sunar.

*English:*  
Pera is a gamified educational platform designed to teach Web3 technologies. The project aims to help users adopt decentralized technologies faster through a fun and interactive experience.

---

## 🧭 Genel Bakış | Overview

Bu proje Docker Compose altyapısı ile hazırlanmıştır ve aşağıdaki servisleri içerir:  
This project is built with Docker Compose and includes the following services:

- *MySQL*: Veritabanı yönetimi için
- *phpMyAdmin*: MySQL veritabanını görsel olarak yönetmek için
- *Backend*: Web3 öğrenme platformunun sunucu tarafı bileşeni

---

## 🚀 Başlarken | Getting Started

### 🧱 Gereksinimler | Requirements

- Docker
- Docker Compose

---

### 📁 Ortam Değişkenleri | Environment Variables

Aşağıdaki ortam değişkenlerini .env dosyasına ekleyin:  
Add the following environment variables to your .env file:

```env
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=your_database_name
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_PORT=3306
PMA_PORT=8080
BACKEND_PORT=8000