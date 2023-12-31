## EZMark

一个简单易用的照片参数水印生成器，支持PWA离线使用。

[预览地址](https://ezmark.lavac.cc/)
![example](https://i.imgur.com/4tsHcCF.png)
![lighthouse](https://i.imgur.com/zZqndhW.png)

目前支持的图片格式包括浏览器本身能支持的格式以及苹果的`.heic`格式。

已添加以下品牌的水印

[logos.json](src/components/Watermark/logos.json)

## Vercel一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLavaCxx%2FEZMark)

## 使用说明

如使用相机或手机原生相机拍摄的照片即可读取EXIF信息。

手机里以非**文件**模式传输的图片都会因为手机的隐私策略抹掉EXIF信息无法读取。

## 代办事项

*斜体*为需要反馈才能确定

- [x] _更多品牌logo_
- [ ] _更多布局_
- [x] PWA
