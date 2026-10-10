---
title: "Towards Looped Models Done Right — Part II: Rethinking at Fixed Points"
date: "2026-09-29"
tags:
  - "Loop Models"
  - "Fixed Points"
  - "Efficient Inference"
highlight: true
venue: "Institute of Foundation Models"
authors:
  - name: "**Benhao Huang**"
  - name: "Chufan Shi"
  - name: "Junlin Chen"
  - name: "Shicheng Wen"
  - name: "Zhengzhong Liu"
  - name: "Eric Xing"
  - name: "Xuezhe Ma"
path: "research/2026/looped-models-fixed-points"
excerpt: "Looped LMs need not pay for every loop: near fixed points, they can scale FLOPs without scaling memory. Fixed-point shortcuts speed up training (pretraining, post-training) and inference (prefill, decoding), while a learned depth prior and orthogonal injection shape better fixed points. With a 3× smaller KV cache, the learned prior matches fixed-depth training at 1.6B."
selected: true
cover: "./preview.png"
links:
  - name: "paper"
    url: "https://www.alphaxiv.org/abs/2610.looped-models-fixed-points"
  - name: "PDF"
    url: "https://github.com/ifm-ai/xllm-loop/blob/main/papers/part2.pdf"
  - name: "Github"
    url: "https://github.com/ifm-ai/xllm-loop"
  - name: "X thread"
    url: "https://x.com/huskydogewoof/status/2106130737007091939"
  - name: "Part I"
    url: "https://huskydoge.github.io/husky-blog/posts/recursive_models/towards-looped-models-done-right/"
priority: -4
---

<blockquote className="twitter-tweet">
  <a href="https://x.com/huskydogewoof/status/2106130737007091939">View this thread on X</a>
</blockquote>
