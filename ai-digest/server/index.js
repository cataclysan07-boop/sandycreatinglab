import Anthropic from '@anthropic-ai/sdk';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic();

const DIGEST_CONTEXT = `你是「高管AI日报」的专属AI助手，今天是2026年5月23日（周五），第312期。

今日精选10条要情摘要如下：

1. [组织变革·9.2分] Shopify CEO：每个团队申请新增人手前必须先证明AI无法完成
   Tobi Lütke明确：所有团队在提出招聘需求前需书面说明为何AI工具无法替代该职能，已使headcount增速同比降低40%。
   洞察：AI native组织从理念到制度落地的典型案例——通过流程约束倒逼管理层重新审视每个岗位的本质价值。

2. [管理能力·8.8分] 麦肯锡报告：AI时代高管最稀缺能力是"判断力"而非"技术理解力"
   全球1400位CEO调研显示，高管层最大差距是在信息过载中快速作出高质量决策的判断力，提出"决策韧性"框架。
   洞察：需将"何时信任AI输出、何时推翻它"作为领导力培训的核心模块。

3. [技术前沿·9.5分] Claude 4 Opus发布：首个在复杂业务推理任务上超越人类专家的商用模型
   法律合同审查、财务异常检测、战略情景分析三类任务上首次超过领域专家基准，API成本降低60%。
   洞察：AI已从辅助工具升级为可承担专家级认知任务的系统——需重新评估哪些外包工作可内化为AI工作流。

4. [战略洞察·8.6分] 字节跳动AI Agent已承担30%的产品迭代决策
   字节"Agent OS"在抖音电商等产品线中自主完成A/B测试设计、上线决策与回滚操作。
   洞察：预示未来产品组织形态：少量人类设定方向和约束，大量Agent执行迭代。

5. [人才与文化·8.1分] LinkedIn数据：标注"AI协作能力"的岗位薪资溢价平均达28%
   AI协作经验岗位薪资较传统岗高出28%，AI增强型分析师+41%、人机协作设计师+38%。
   洞察：人才竞争已从"抢AI专家"转变为"抢懂得与AI协作的业务人才"。

6. [组织变革·7.9分] Klarna重新招人：激进裁员后AI局限性暴露，客服质量下滑20%
   大规模以AI替换客服后正重新招募人类客服，AI客服在情感投诉处理解决率比人类低23%。
   洞察：AI替代人工的边界是场景识别问题，高情感复杂度的客户交互仍需人类介入。

7. [管理能力·8.3分] 斯坦福HAI研究：管理者对AI的"校准信任"是团队绩效最强预测因子
   240个企业团队18个月研究：管理者AI校准信任度与绩效相关性r=0.71。
   洞察："AI校准信任"应成为企业下一轮管理者评估的核心维度。

8. [战略洞察·8.7分] 高盛：2026年企业AI投资回报率首次出现明显分化，头部ROI是末尾的7倍
   高回报企业共同特征：AI战略与业务战略深度耦合、存在"AI价值转化"专职角色、数据基础设施投入占比超40%。
   洞察："投了AI"已不带来竞争优势——"怎么投、投在哪"才是决定胜负的关键。

9. [技术前沿·7.6分] OpenAI推出企业记忆API：AI助手可跨会话积累组织知识
   Memory API允许AI自动归纳跨会话决策偏好，内测显示重复提示减少65%，新员工上手时间缩短30%。
   洞察：企业AI从工具进化为"有组织记忆的协作者"，向组织能力基础设施转变的关键一步。

10. [人才与文化·7.4分] 微软Viva：AI重度用户满意度高31%，但"AI疲劳"出现新信号
    日均使用AI超2小时员工满意度更高，但22%出现"信息过载感加重"和决策疲劳。
    洞察：需关注AI导入带来的"隐性认知负担"——工作设计需在AI赋能与认知保护之间找新平衡。

---
你的职责：帮助高管深度理解和运用以上内容。
- 可对任何条目深入解读、延伸思考
- 可帮助高管思考这些趋势对自己公司/行业的具体影响
- 可提供决策建议或行动框架
- 回答请简洁有力，符合高管阅读习惯，避免冗余废话
- 使用中文回答`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      system: DIGEST_CONTEXT,
      messages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

app.listen(3001, () => {
  console.log('AI Digest backend running on http://localhost:3001');
});
