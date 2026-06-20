---
layout: post
title: "Type-safe registry access in .NET"
description: "Wrapping the Windows registry behind a small, strongly-typed API so the call site reads like intent, not plumbing."
tags: [dotnet, csharp, windows]
---

The Windows registry API is one of those things you only touch occasionally —
just often enough to forget the exact ceremony, and just rarely enough that you
copy-paste it wrong. That itch is why I wrote
[RegistryWrapper](https://github.com/terellison/RegistryWrapperCore).

<!--more-->

## The problem

Reading a value with the built-in API looks something like this:

```csharp
using Microsoft.Win32;

object? raw = Registry.GetValue(
    @"HKEY_LOCAL_MACHINE\SOFTWARE\MyApp",
    "InstallPath",
    null);

string installPath = raw as string ?? throw new InvalidOperationException();
```

There's a lot going on for what is, conceptually, *"give me this string."* You
deal with `object?`, a stringly-typed key path, manual null handling, and a cast
that silently lies if the value is the wrong type.

## A small abstraction

The goal isn't to reinvent the API — it's to make the **call site read like the
intent**. A thin, generic accessor gets us most of the way:

```csharp
public static T GetValue<T>(RegistryHive hive, string subKey, string name)
{
    using RegistryKey root = RegistryKey.OpenBaseKey(hive, RegistryView.Default);
    using RegistryKey? key = root.OpenSubKey(subKey)
        ?? throw new KeyNotFoundException($"Missing subkey: {subKey}");

    object? value = key.GetValue(name)
        ?? throw new KeyNotFoundException($"Missing value: {name}");

    return (T)Convert.ChangeType(value, typeof(T));
}
```

Now the everyday case is unambiguous:

```csharp
string path = RegistryWrapper.GetValue<string>(
    RegistryHive.LocalMachine, @"SOFTWARE\MyApp", "InstallPath");
```

## Why it's worth the wrapper

A few things fall out of this for free:

- **The type is the contract.** `GetValue<int>` either gives you an `int` or
  throws — no silent `null` from a bad cast.
- **Failures are loud and specific.** A missing key and a missing value are
  different exceptions with useful messages.
- **`using` everywhere.** Registry handles are disposable; centralizing access
  means you can't forget to release them.

> Good abstractions don't hide capability — they hide *ceremony*. The wrapper
> still lets you reach the raw API when you need it; it just makes the 95% case
> pleasant.

I keep two flavors of this around — one targeting
[.NET Framework](https://github.com/terellison/RegistryWrapper) and one for
[.NET Core](https://github.com/terellison/RegistryWrapperCore) — because the
registry isn't going anywhere, and neither is my need to read from it without
wincing.
