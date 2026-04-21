# AVPN Learning Portal Kickoff

**Date:** April 21, 2026
**Participants:** Aravind Karthik, Manas Vaze
**Recording:** https://fathom.video/share/gNmwZErxpuCq8nyVFca6gsA6xfAeFWCB
**Duration:** 8 mins

---

## Transcript

0:06 - Aravind Karthik
So basically, you went through the docs, right?

0:10 - Manas Vaze (Realfast)
Yeah, and some inclination towards just one chatbot, and as you said, a bunch of crud along with it.

0:22 - Aravind Karthik
So, I mean, basically, let's not build any of the crud stuff. I think we basically need to focus on the chatbot itself, and basically, we need like a shell UI where you can sort of get an indicator of what the platform might look like, and we'll build a basic chatbot. But, I mean, the problem is we need to use Gemini Ka Vortex, Age, and whatever.

0:58 - Manas Vaze (Realfast)
So... So... So... So,

1:04 - Aravind Karthik
This is their existing cycle, there is, go to learning courses, there is something, go to academy, so wait, go back to that task, learning programs, AI essentials were the first one, I think this is the program we are sort of contributing to, there is one page that Vinay had shared, which It's hard, like, what you call it, I mean, basically, they had a website with a list of courses, let's see, I think I found it, yeah, click the link, I sent it, yeah. These are their current courses. I mean, they are pretty much going to revamp this site. Let's just extract this and then make a chatbot about it. Got it.

3:25 - Manas Vaze (Realfast)
So right now, what you're saying is this particular page is like a web portal where people who come here can use these filters, go through all the content in each of those pages and decide which one to take up. Yeah. We want to give it a better, like a smarter chatbot experience where they can ask questions, hone in on the courses that make sense to them and register. Yep.

3:53 - Aravind Karthik
And not only that. Yeah, they should get post recommendations and basically generic AI, generic knowledge about some AI stuff under the requirements mentions.

Like, I think let's just build one shell website, which is similar to this. Let's create information from here, put it on that. Let me see, I'll have to go through the Google Vortex Agent Builder and all of that.

4:37 - Manas Vaze (Realfast)
Vortex? Vortex AI Studio. Oh my god, okay.

4:47 - Aravind Karthik
So there is basically a full fledged agent development platform.

4:56 - Manas Vaze (Realfast)
Okay. Agent Builder, you know, click that link.

5:07 - Aravind Karthik
So we're going to start building your AI agent. These people have like a bunch of generic agents that you can readily deploy. Anyway, I'll start exploring this, you in the meanwhile start working on the website and then I'll loop you in once I figure out which is the right thing for our students. So for now...

6:00 - Manas Vaze (Realfast)
We want basically like a replica of this? Some sort of replica.

6:06 - Aravind Karthik
Also, I mean, I don't know how much design thought process you can even put in at this point, but like it's a very basic thing. Just seeing the requirements if there's anything that catches your eye, which we can also demonstrate, other than the chatbot.

6:33 - Manas Vaze (Realfast)
So, this is the learner portal and then there is local training provider portal? No, they didn't make it.

6:41 - Aravind Karthik
So, we need to learner portal?

6:43 - Manas Vaze (Realfast)
Yes, learner portal. Okay, and is it fine if I just like do it via like to some sort of a chatbot experience with Claude and then later we plug it with some other thing?

6:58 - Aravind Karthik
No, no, I also... I [want] to use this for us to understand what is there in the Google Agent Builder.

7:04 - Manas Vaze (Realfast)
Okay, okay.

7:06 - Aravind Karthik
It will be a learning experience class also.

7:11 - Manas Vaze (Realfast)
Okay, let me get a local copy of this first and maybe later in the day, once you are done with that, we can sync again and see. Yeah.

7:22 - Aravind Karthik
I'll create a repo for this. Yeah. And then we can work on that.

7:28 - Manas Vaze (Realfast)
Yeah. Bye. Bye. Bye.

---

## Key Decisions

1. **No CRUD** — skip admin/LTP portals entirely for now
2. **Chatbot is the focus** — the main deliverable for this sprint
3. **Shell UI only** — basic replica of current portal as a container for the chatbot
4. **Must use Google Vertex AI / Agent Builder** — not Claude or other providers
5. **Karthik owns agent/platform selection** — will explore Vertex and loop Manas in
6. **Manas owns shell website** — extract course data, build basic portal
7. **Learning exercise** — also about understanding Google's agent tooling

## Action Items

| Who | What | Status |
|-----|------|--------|
| Manas | Extract course data from live site | Done |
| Manas | Build shell learner portal (replica) | Done |
| Manas | Look for anything extra to demonstrate beyond chatbot | In progress |
| Karthik | Explore Google Agent Builder / Vertex AI Studio | Pending |
| Karthik | Select right agent type for the use case | Pending |
| Karthik | Create shared repo | Pending |
| Both | Sync after Karthik's exploration | Pending |
