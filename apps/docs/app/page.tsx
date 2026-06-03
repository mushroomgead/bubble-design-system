"use client";

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Divider,
  DropdownMenu,
  Input,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Switch,
  Tabs,
  Toast,
  Tooltip,
  useToast,
} from "@plain-design-system/ui";
import Link from "next/link";
import { useState } from "react";
import { ThemeBar } from "./ThemeBar";

const buttonVariants = ["primary", "secondary", "destructive", "ghost"] as const;
const sizes = ["sm", "md", "lg"] as const;
const badgeVariants = ["neutral", "brand", "success", "warning", "danger"] as const;
const alertVariants = ["info", "success", "warning", "danger"] as const;

function ToastDemo() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            title: "Saved",
            description: "Your changes have been saved successfully.",
          })
        }
      >
        Fire toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            title: "Heads up",
            description: "This will auto-dismiss in 5 seconds.",
            timeout: 5000,
          })
        }
      >
        With timeout
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          toast.add({ description: "Description-only toast" })
        }
      >
        No title
      </Button>
    </div>
  );
}

export default function HomePage() {
  const [radioVal, setRadioVal] = useState<unknown>("comfortable");
  const [checkA, setCheckA] = useState(true);
  const [checkB, setCheckB] = useState(false);
  return (
    <Toast.Provider>
      <Tooltip.Provider>
        <main className="mx-auto max-w-5xl px-6 pb-16 space-y-16">
          <ThemeBar />
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Plain DS</h1>
            <p className="text-text-secondary">
              Component gallery — verifying tokens render as expected. Use the
              bar above to switch theme, brand, radius, density, gray family,
              or font live.
            </p>
            <p className="text-sm">
              <Link
                href="/tokens"
                className="text-text-brand hover:underline underline-offset-4"
              >
                Design tokens reference →
              </Link>
            </p>
          </header>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Button · variants × sizes</h2>
            <div className="space-y-4">
              {buttonVariants.map((variant) => (
                <div key={variant} className="flex items-center gap-4">
                  <span className="w-28 text-sm text-text-secondary">{variant}</span>
                  {sizes.map((size) => (
                    <Button key={size} variant={variant} size={size}>
                      {size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Input</h2>
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              {sizes.map((size) => (
                <Input key={size} size={size} placeholder={`Size ${size}`} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              <Input placeholder="Default" />
              <Input placeholder="Disabled" disabled />
              <Input placeholder="Invalid" invalid defaultValue="bad@" />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Checkbox</h2>
            <div className="flex items-center gap-6">
              {sizes.map((size) => (
                <label key={size} className="inline-flex items-center gap-2 cursor-pointer">
                  <Checkbox size={size} defaultChecked />
                  <span className="text-sm">{size}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <Checkbox />
                <span className="text-sm">Unchecked</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <Checkbox defaultChecked />
                <span className="text-sm">Checked</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <Checkbox indeterminate />
                <span className="text-sm">Indeterminate</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-not-allowed">
                <Checkbox disabled />
                <span className="text-sm text-text-disabled">Disabled</span>
              </label>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Radio</h2>
            <RadioGroup defaultValue="m" className="flex-row gap-6">
              {sizes.map((size) => (
                <label key={size} className="inline-flex items-center gap-2 cursor-pointer">
                  <Radio size={size} value={size[0]} />
                  <span className="text-sm">{size}</span>
                </label>
              ))}
            </RadioGroup>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Switch</h2>
            <div className="flex items-center gap-6">
              {sizes.map((size) => (
                <label key={size} className="inline-flex items-center gap-2 cursor-pointer">
                  <Switch size={size} defaultChecked />
                  <span className="text-sm">{size}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Select</h2>
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              {sizes.map((size) => (
                <Select.Root key={size} defaultValue="">
                  <Select.Trigger size={size}>
                    <Select.Value placeholder={`Size ${size}`} />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="apple">Apple</Select.Item>
                    <Select.Item value="banana">Banana</Select.Item>
                    <Select.Item value="cherry">Cherry</Select.Item>
                    <Select.Item value="grape" disabled>
                      Grape (disabled)
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Badge</h2>
            <div className="space-y-3">
              {badgeVariants.map((variant) => (
                <div key={variant} className="flex items-center gap-3">
                  <span className="w-24 text-sm text-text-secondary">{variant}</span>
                  <Badge variant={variant} size="sm">
                    Small
                  </Badge>
                  <Badge variant={variant} size="md">
                    Medium
                  </Badge>
                  <Badge variant={variant} size="lg">
                    Large
                  </Badge>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Avatar</h2>
            <div className="flex items-center gap-4">
              <Avatar size="sm">
                <Avatar.Fallback>KK</Avatar.Fallback>
              </Avatar>
              <Avatar size="md">
                <Avatar.Fallback>KK</Avatar.Fallback>
              </Avatar>
              <Avatar size="lg">
                <Avatar.Fallback>KK</Avatar.Fallback>
              </Avatar>
              <Avatar size="xl">
                <Avatar.Fallback>KK</Avatar.Fallback>
              </Avatar>
              <Avatar size="lg">
                <Avatar.Image src="https://i.pravatar.cc/120?img=12" alt="User" />
                <Avatar.Fallback delay={600}>JD</Avatar.Fallback>
              </Avatar>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Divider</h2>
            <div className="space-y-3">
              <p className="text-sm">Above</p>
              <Divider />
              <p className="text-sm">Below</p>
            </div>
            <div className="flex items-center gap-3 h-8">
              <span className="text-sm">Left</span>
              <Divider orientation="vertical" />
              <span className="text-sm">Middle</span>
              <Divider orientation="vertical" />
              <span className="text-sm">Right</span>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Alert</h2>
            <div className="space-y-3 max-w-2xl">
              {alertVariants.map((variant) => (
                <Alert key={variant} variant={variant} title={`${variant} alert`}>
                  Token-driven background, border, and icon color via{" "}
                  <code className="font-mono text-xs">--color-bg-{variant}</code> /{" "}
                  <code className="font-mono text-xs">--color-text-{variant}</code>.
                </Alert>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Modal</h2>
            <Modal.Root>
              <Modal.Trigger
                render={(props) => <Button {...props}>Open modal</Button>}
              />
              <Modal.Content>
                <Modal.Title>Confirm deletion</Modal.Title>
                <Modal.Description>
                  This action can't be undone. The selected items will be removed
                  from your workspace.
                </Modal.Description>
                <div className="mt-6 flex justify-end gap-2">
                  <Modal.Close
                    render={(props) => (
                      <Button {...props} variant="ghost">
                        Cancel
                      </Button>
                    )}
                  />
                  <Modal.Close
                    render={(props) => (
                      <Button {...props} variant="destructive">
                        Delete
                      </Button>
                    )}
                  />
                </div>
              </Modal.Content>
            </Modal.Root>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Tooltip</h2>
            <div className="flex items-center gap-4">
              <Tooltip.Root>
                <Tooltip.Trigger
                  render={(props) => <Button {...props} variant="secondary">Hover me</Button>}
                />
                <Tooltip.Content>Top tooltip</Tooltip.Content>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger
                  render={(props) => <Button {...props} variant="secondary">Right</Button>}
                />
                <Tooltip.Content side="right">On the right</Tooltip.Content>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger
                  render={(props) => <Button {...props} variant="secondary">Bottom</Button>}
                />
                <Tooltip.Content side="bottom">Bottom side</Tooltip.Content>
              </Tooltip.Root>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Tabs</h2>
            <Tabs defaultValue="overview">
              <Tabs.List>
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="usage">Usage</Tabs.Tab>
                <Tabs.Tab value="settings">Settings</Tabs.Tab>
                <Tabs.Tab value="locked" disabled>
                  Locked
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="overview">
                <p className="text-sm text-text-secondary">
                  Overview panel content. The animated indicator under the
                  active tab uses <code className="font-mono text-xs">--active-tab-width</code>{" "}
                  and <code className="font-mono text-xs">--active-tab-left</code> CSS vars.
                </p>
              </Tabs.Panel>
              <Tabs.Panel value="usage">
                <p className="text-sm text-text-secondary">Usage panel content.</p>
              </Tabs.Panel>
              <Tabs.Panel value="settings">
                <p className="text-sm text-text-secondary">Settings panel content.</p>
              </Tabs.Panel>
            </Tabs>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Dropdown Menu</h2>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger
                render={(props) => <Button {...props} variant="secondary">Open menu</Button>}
              />
              <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => console.log("New")}>
                  New file
                </DropdownMenu.Item>
                <DropdownMenu.Item>Open…</DropdownMenu.Item>
                <DropdownMenu.Item disabled>Save (disabled)</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Group>
                  <DropdownMenu.Label>Toggles</DropdownMenu.Label>
                  <DropdownMenu.CheckboxItem
                    checked={checkA}
                    onCheckedChange={setCheckA}
                  >
                    Show sidebar
                  </DropdownMenu.CheckboxItem>
                  <DropdownMenu.CheckboxItem
                    checked={checkB}
                    onCheckedChange={setCheckB}
                  >
                    Show inspector
                  </DropdownMenu.CheckboxItem>
                </DropdownMenu.Group>
                <DropdownMenu.Separator />
                <DropdownMenu.RadioGroup value={radioVal} onValueChange={setRadioVal}>
                  <DropdownMenu.Label>Density</DropdownMenu.Label>
                  <DropdownMenu.RadioItem value="compact">
                    Compact
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="default">
                    Default
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="comfortable">
                    Comfortable
                  </DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Toast</h2>
            <ToastDemo />
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Skeleton</h2>
            <div className="max-w-md space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton shape="circle" className="size-10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-1/2" />
                  <Skeleton className="w-3/4" />
                </div>
              </div>
              <Skeleton shape="block" className="h-32 w-full" />
            </div>
          </section>

        </main>
        <Toast.Toaster />
      </Tooltip.Provider>
    </Toast.Provider>
  );
}
