# 跨境支付实操指南 (Gumroad + 虚拟银行结汇)

针对你的现状：**大陆个体工商户执照** + **VPN (IP不固定)** + **高风险业务（占卜/命理）**，传统的 Stripe、PayPal、Airwallex 会因为 IP 跳动或业务类型极大概率封号。

以下是最稳妥的 **Gumroad + 万里汇(LianLian) / Payoneer 结汇链路** 的实操步骤。

---

## 核心链路架构
海外用户支付 (美元) ➔ **Gumroad** (代收+抗风控) ➔ **虚拟美国银行账户** (万里汇/Payoneer提供) ➔ **提现结汇**至国内银行卡/支付宝 (人民币)。

---

## 第一步：注册并获取虚拟美元银行账户
由于 Gumroad 目前对中国大陆创作者主要支持 PayPal 和美国银行账户（ACH）提现，且你的 PayPal 容易被风控，我们**必须使用虚拟美国银行账户**来接收 Gumroad 的打款。

1. **选择结汇平台**：
   - 推荐 **万里汇 (LianLian Global)** 或 **派安盈 (Payoneer)**。它们都支持中国大陆**个体工商户**注册。
2. **准备材料**：
   - 你的大陆身份证、个体工商户营业执照照片。
3. **申请美元收款账户**：
   - 注册成功后，在平台后台申请一个 **“美国本地收款账户 (USD Local Account)”**。
   - 平台会分配给你一个包含 **Routing Number (汇款路线号码)** 和 **Account Number (账号)** 的虚拟美国银行账户。

---

## 第二步：注册并配置 Gumroad
Gumroad 作为“记录商家 (Merchant of Record)”，相当于买家是在向 Gumroad 付款，所以它能帮你抗下绝大多数的信用卡风控，且它对卖家的登录 IP 要求比金融机构（Stripe）宽松得多。

1. **注册账号**：
   - 挂着 VPN（即使节点跳动也没关系），使用常用邮箱注册 Gumroad。
   - 建议在 Gumroad 的个人资料中，将你的品牌定位为 **"Digital Content Creator"** 或 **"Personality Analyst"**，避免过度强调 "Fortune Telling" 或 "Astrology"。
2. **上架商品**：
   - 创建一个名为 **"Digital Assessment"** 或 **"Personality Reading"** 的单件商品（Single Product）。
   - 定价设定为 `$1.99`。
   - 将生成的商品链接（如 `https://gumroad.com/l/your-product-id`）填入你前端代码的购买按钮中。
3. **配置提现方式 (Payouts)**：
   - 进入 Gumroad 的 **Settings -> Payouts**。
   - 国家选择 **United States**（注意：必须选美国，才能绑定刚才的虚拟账户）。
   - 填入万里汇/Payoneer 提供给你的 **Routing Number** 和 **Account Number**。
   - 填写你的拼音姓名和个体户地址。

---

## 第三步：防封号与日常运营建议

虽然 Gumroad 的风控较弱，但由于你处于 VPN 节点跳动的环境，仍需注意以下红线：

1. **不要自己刷单测试**：
   - **绝对不要**用你正在挂 VPN 的设备和国内的双币信用卡去购买自己的 Gumroad 商品测试！这会被立刻判定为信用卡套现/欺诈，直接封禁。
   - 如果需要测试购买流程，请使用 Gumroad 提供的 [Test Mode (测试模式)](https://help.gumroad.com/article/71-testing-your-product) 专用虚拟卡号。
2. **尽量稳定 IP（可选方案）**：
   - 虽然 Gumroad 容忍度高，但在进行**修改收款账号、大额提现**等敏感操作时，最好确保 VPN 节点在美国，且与平时登录的节点大方向一致。
   - 如果未来业务做大，建议购买一个 **静态住宅 IP (Static Residential IP)**，配置在浏览器插件（如 SwitchyOmega 或指纹浏览器）中，专用于登录支付后台。
3. **退款与客诉处理**：
   - 虚拟产品容易遇到恶意退款。如果用户在 Gumroad 发起退款请求，建议**爽快同意**，千万不要让纠纷升级为银行的 Chargeback（拒付）。拒付率一旦超过 1%，Gumroad 也会停止你的账号。
   - 这也是为什么我们要在网站补充 `Refund Policy`（声明虚拟商品不退款）的原因，但在实操中，为了保账号，遇到刺头直接退款是成本最低的。

---

## 第四步：备用链路 (Crypto 支付)
我们在网站前端也加入了 **"Pay with Crypto"** 的按钮。
- **推荐平台**：**NOWPayments** 或 **Coinbase Commerce**。
- **优势**：仅需邮箱即可注册，无需 KYC 营业执照审核，没有国家限制，且 **0 拒付风险**。
- **操作**：注册 NOWPayments，生成一个固定金额的 Payment Link 挂在网站上即可。用户支付的数字货币（如 USDT/USDC）会直接进入你自己的数字钱包。